# -*- coding: utf-8 -*-
"""把「能直接联系到雇主」的岗位挑出来，补进加密资料库。

做两件事：
1. 给 data/jobs-private.json 里每条岗位补上 contact / contact_kind / contact_label，
   联系方式从完整原文里重新提取（以前描述被截断，末尾的联系方式丢了）。
2. 读取本机社媒雷达采到的带微信 / Telegram / 邮箱的招聘线索，按标题去重后并入，
   并单独导出 data/jobs-contacts.json，供「补充密文」使用——这样云端每天自动更新
   主密文时，这批能直接联系的岗位不会被冲掉。

只跑本地文件，不需要网络。
"""
import glob
import hashlib
import json
import os
import re
import sqlite3
import sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE)
sys.path.insert(0, os.path.join(BASE, "scripts"))
import fetch_jobs as fj  # 复用分类、金额、联系方式提取

PV_PATH = os.path.join(BASE, "data", "jobs-private.json")
EXTRA_PATH = os.path.join(BASE, "data", "jobs-contacts.json")

KIND = {
    "wx": "微信", "wechat": "微信", "tg": "Telegram", "telegram": "Telegram",
    "em": "邮箱", "email": "邮箱", "wa": "WhatsApp", "wagroup": "WhatsApp 群",
    "ph": "电话", "tel": "电话", "phone": "电话", "dm": "站内私信",
}
RE_SELF = re.compile(
    r"\[\s*for\s*hire\s*\]|forhire|\bhire\s+me\b|\bavailable\s+for\b|"
    r"\bmy\s+services\b|接单|承接|我能做|提供服务", re.I)
NOT_A_CONTACT = {
    "groups", "group", "channel", "channels", "me", "us", "here", "there",
    "link", "bio", "dm", "pm", "yes", "no", "only", "available", "n/a",
    "none", "tbd", "discord", "telegram", "whatsapp", "wechat", "email",
    "私信", "微信群", "private", "direct", "preferred",
}


def norm(s):
    return re.sub(r"[\W_]+", "", (s or "").lower())


def parse_contact(s):
    """解析 wx:xxx|tg:xxx|em:xxx|dm:xxx 这类结构化联系方式。"""
    out = []
    for seg in re.split(r"[|,]", s or ""):
        k, _, v = seg.strip().partition(":")
        k, v = k.strip().lower(), v.strip().strip("*.,;)|_ ")
        label = KIND.get(k)
        if label and v and len(v) >= 3 and v.lower() not in NOT_A_CONTACT:
            out.append((label, v))
    return out


def build_contact(parts):
    direct = [(k, v) for k, v in parts if k != "站内私信"]
    if direct:
        return (
            "   ".join("%s：%s" % (k, v) for k, v in direct[:8]),
            "direct",
            " · ".join(dict.fromkeys(k for k, _ in direct)),
        )
    if parts:
        return "仅支持站内私信（%s）" % parts[0][1], "dm", "站内私信"
    return "", "", ""


def iso(s):
    s = (s or "").strip()
    try:
        d = datetime.fromisoformat(s.replace("Z", "+00:00"))
        if d.tzinfo is None:
            d = d.replace(tzinfo=timezone.utc)
        return d.astimezone(timezone.utc).isoformat(timespec="seconds")
    except Exception:
        return datetime.now(timezone.utc).isoformat(timespec="seconds")


def find_radar_db():
    # 工作目录结构：<WorkBuddy>/<会话目录>/work 与 <WorkBuddy>/<另一会话目录>/social-radar
    wb = os.path.dirname(os.path.dirname(BASE))
    pats = [
        os.path.join(wb, "*", "social-radar", "data", "radar.db"),
        os.path.join(os.path.dirname(BASE), "social-radar", "data", "radar.db"),
    ]
    for pat in pats:
        hits = glob.glob(pat)
        if hits:
            return hits[0]
    return ""


def main():
    if not os.path.exists(PV_PATH):
        print("找不到内部档案，先跑一次岗位抓取")
        return 1
    pv = json.load(open(PV_PATH, encoding="utf-8"))
    jobs = pv.get("jobs", [])

    # 可重复运行：清掉上一次并入的雷达条目和提取结果，从干净状态重建
    if os.environ.get("RESET_CONTACTS") == "1":
        jobs[:] = [j for j in jobs if not str(j.get("id", "")).startswith("r")]
        for j in jobs:
            if "平台投标" not in (j.get("contact") or ""):
                j["contact"] = ""
            j.pop("contact_kind", None)
            j.pop("contact_label", None)
        print("已重置联系方式，重新提取")

    # 1) 给现有岗位重新提取联系方式 / 打上分组标签
    for j in jobs:
        if j.get("contact_kind") in ("direct", "dm"):
            continue
        text = " ".join([j.get("title") or "", j.get("desc") or "", j.get("contact") or ""])
        ctext, ckind, clabel = fj.extract_contacts(text)
        if ckind:
            j["contact"], j["contact_kind"], j["contact_label"] = ctext, "direct", clabel
        elif "平台投标" in (j.get("contact") or "") or "登录后" in (j.get("contact") or ""):
            j["contact_kind"], j["contact_label"] = "platform", "平台投标"
        elif j.get("url"):
            j["contact_kind"], j["contact_label"] = "link", "原帖链接"
        else:
            j["contact_kind"], j["contact_label"] = "", ""

    # 2) 并入社媒雷达里带联系方式的招聘线索
    db = find_radar_db()
    added = enriched = 0
    if db:
        con = sqlite3.connect(db)
        con.row_factory = sqlite3.Row
        rows = con.execute(
            "select title,body,author,url,published,source,contact from items "
            "where contact is not null and trim(contact) != ''"
        ).fetchall()
        con.close()
        by_title = {}
        for j in jobs:
            by_title[norm(j.get("title"))] = j
            if j.get("title_zh"):
                by_title.setdefault(norm(j["title_zh"]), j)

        for r in rows:
            title = (r["title"] or "").strip()
            nk = norm(title)
            if not title or RE_SELF.search(title):
                continue
            # 标题看不出是什么工作的，收进来也没法用
            if len(nk) < 6 or nk in ("hiring", "task", "offer", "recruiting", "job", "vacancy"):
                continue
            ctext, ckind, clabel = build_contact(parse_contact(r["contact"]))
            if not ckind:
                continue
            key = norm(title)
            old = by_title.get(key)
            if old:
                if old.get("contact_kind") != "direct":
                    old["contact"], old["contact_kind"], old["contact_label"] = ctext, ckind, clabel
                if not old.get("url") and r["url"]:
                    old["url"] = r["url"]
                enriched += 1
                continue
            body = r["body"] or ""
            text = title + " " + body
            m = fj.RE_MONEY.search(text)
            salary = (m.group(0) or "").strip() if m else ""
            new = {
                "id": "r" + hashlib.sha1((title + (r["url"] or "")).encode("utf-8")).hexdigest()[:11],
                "title": title[:140],
                "title_zh": title if re.search(r"[\u4e00-\u9fff]", title) else "",
                "desc": fj.clean_text(body, 6000),
                "cat": fj.classify(text),
                "source": (r["source"] or "社媒") + (" · " + r["author"] if r["author"] else ""),
                "url": r["url"] or "",
                "published": iso(r["published"]),
                "salary": salary,
                "quote": fj.discount_salary(salary),
                "contact": ctext,
                "contact_kind": ckind,
                "contact_label": clabel,
            }
            jobs.append(new)
            by_title[key] = new
            added += 1
        print("雷达数据库：%s" % os.path.basename(os.path.dirname(os.path.dirname(db))))
    else:
        print("没找到社媒雷达数据库，跳过并入（不影响主流程）")

    pv["count"] = len(jobs)
    json.dump(pv, open(PV_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    contacts = [j for j in jobs if j.get("contact_kind") in ("direct", "dm")]
    json.dump(
        {"updated": pv.get("updated"), "count": len(contacts), "jobs": contacts},
        open(EXTRA_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=1
    )

    from collections import Counter
    stat = Counter(j.get("contact_kind") or "none" for j in jobs)
    print("内部档案共 %d 条：可直接联系 %d · 站内私信 %d · 原帖 %d · 平台投标 %d · 无 %d"
          % (len(jobs), stat["direct"], stat["dm"], stat["link"], stat["platform"], stat["none"]))
    print("新并入 %d 条，给已有岗位补上联系方式 %d 条" % (added, enriched))
    print("已导出补充档案 %d 条 → data/jobs-contacts.json" % len(contacts))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
