# -*- coding: utf-8 -*-
"""生成对外分享页数据：只放「可直接联系」的岗位，联系方式一律不外露。

两种模式：
  本机（默认）：从 data/jobs-contacts.json 全量重建，包含本机采集的线索。
  云端（SHARE_MODE=ci）：从云端刚抓的 jobs-private.json 里挑新增的带联系方式岗位，
  与仓库里已有的分享数据合并。这样分享页每 3 小时跟着岗位站一起更新。

分享页 public/share.html 不需要密码，任何人都能看岗位，
但看不到雇主的微信 / Telegram / 邮箱 / 原帖链接，想对接只能加顾问微信。
"""
import json
import os
import re
import sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE)
sys.path.insert(0, os.path.join(BASE, "scripts"))
import fetch_jobs as fj  # 复用公开清洗规则

OUT = os.path.join(BASE, "public", "share-jobs.json")
CI_MODE = os.environ.get("SHARE_MODE") == "ci"

# 有人会把微信号做成 base64 塞进标题 / 描述，普通清洗抓不到
EXTRA_SCRUB = [
    (re.compile(r"\b[A-Za-z0-9+/]{16,}={0,2}\b"), " "),
    (re.compile(r"(?:简历|资料|详情)\s*发\s*我|发\s*我\s*内推|私\s*聊|加\s*我", re.I), " "),
    (re.compile(r"\b(?:whatsapp|telegram|wechat|weixin|vx|微信|discord|skype)\b", re.I), "社交平台"),
]


def clean_title(s):
    t = fj.scrub(s or "")
    for pat, rep in EXTRA_SCRUB:
        t = pat.sub(rep, t)
    return " ".join(t.split())[:120]


def to_share(j):
    # 只给标题 / 薪资 / 编号：原始描述最容易夹带联系方式，一律不放，
    # 想了解详情只能加顾问微信。
    return {
        "id": j.get("id", ""),
        "title": clean_title(j.get("title_zh") or j.get("title") or ""),
        "cat": j.get("cat", "misc"),
        "salary": j.get("quote") or j.get("salary") or "",
        "published": j.get("published", ""),
        "source": "海外在招",
    }


def collect():
    if CI_MODE:
        src = os.path.join(BASE, "data", "jobs-private.json")
        if not os.path.exists(src):
            return []
        d = json.load(open(src, encoding="utf-8"))
        return [j for j in d.get("jobs", []) if (j.get("contact_kind") or "") == "direct"]
    src = os.path.join(BASE, "data", "jobs-contacts.json")
    if not os.path.exists(src):
        print("找不到扩展岗位档案，先跑一次「立刻更新资料库.bat」")
        raise SystemExit(1)
    d = json.load(open(src, encoding="utf-8"))
    return [j for j in d.get("jobs", []) if (j.get("contact_kind") or "") == "direct"]


def main():
    jobs = collect()
    if not jobs:
        print("[share] 没有可分享的岗位，保留现有数据")
        return 0

    merged = {}
    if CI_MODE and os.path.exists(OUT):
        # 云端是增量：保留本机已有的那批，用同编号的新数据覆盖
        old = json.load(open(OUT, encoding="utf-8"))
        for j in old.get("jobs", []):
            merged[j["id"]] = j
    for j in jobs:
        item = to_share(j)
        if item["id"] and item["title"]:
            merged[item["id"]] = item

    out_jobs = sorted(merged.values(), key=lambda x: str(x.get("published") or ""), reverse=True)
    result = {
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "count": len(out_jobs),
        "jobs": out_jobs,
    }
    json.dump(result, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("[share] %s已生成 %d 条对外展示岗位 → public/share-jobs.json" %
          ("增量合并 " if CI_MODE else "全量重建 ", len(out_jobs)))

    # 交付前自检：公开数据里不能出现任何联系方式或原帖链接
    raw = json.dumps(result, ensure_ascii=False)
    problems = []
    for label, pat in [
        ("邮箱", r"[\w.+-]+@[\w-]+\.[\w.-]+\.[A-Za-z]{2,}"),
        ("链接", r"https?://|www\.|t\.me/|wa\.me/"),
        ("@账号", r"(?<![A-Za-z0-9_])@[A-Za-z0-9_]{3,31}\b"),
        ("电话", r"\+\d[\d\s\-().]{7,18}\d"),
        ("联系句式", r"whatsapp|telegram|微信|wechat|dm\s+me|加我|联系我"),
        ("编码联系方式", r"\b[A-Za-z0-9+/]{16,}={0,2}\b"),
    ]:
        if re.search(pat, raw, re.I):
            problems.append(label)
    if problems:
        print("[share] ❌ 仍有残留：" + "、".join(problems))
        return 1
    print("[share] ✅ 邮箱 / 链接 / @账号 / 电话 / 联系句式 / 编码串 全部为 0")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
