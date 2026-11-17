# -*- coding: utf-8 -*-
"""一键上线：同步远程最新数据 -> 自动处理数据冲突 -> 推送 GitHub -> Vercel 自动部署。

背景：网站会自动提交岗位数据，所以本机推送前需要先同步。
如果岗位数据文件冲突，自动采用远程最新数据并做一次格式规整。
"""
import json
import os
import re
import subprocess

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE)


def run(*args, env=None):
    e = os.environ.copy()
    e["GIT_EDITOR"] = "true"
    if env:
        e.update(env)
    return subprocess.run(args, capture_output=True, text=True,
                          encoding="utf-8", errors="replace", env=e)


def tailout(r, n=500):
    return ((r.stdout or "") + (r.stderr or "")).strip()[-n:]


def clean_data():
    """规整岗位数据：清理多余空白、统一来源标签。"""
    path = os.path.join(BASE, "data", "jobs.json")
    try:
        data = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        print("读取数据失败：", e)
        return
    for j in data.get("jobs", []):
        for k in ("title", "desc"):
            if j.get(k):
                j[k] = re.sub(r"[ \t]{2,}", " ", j[k])
                j[k] = re.sub(r"\n\s*\n\s*\n+", "\n\n", j[k]).strip()
        j["source"] = "海外在招"
    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("已规整 %d 条岗位数据" % data.get("count", 0))


def main():
    print("[1/4] 同步远程最新数据 ...")
    r = run("git", "fetch", "origin")
    if r.returncode != 0:
        print("同步失败（检查网络/代理）：", tailout(r, 300))
        return 1

    print("[2/4] 合并远程自动更新的岗位数据 ...")
    r = run("git", "rebase", "origin/master")
    if r.returncode != 0:
        print("检测到冲突：岗位数据用远程最新，加密档案用本地最新，自动规整后继续 ...")
        c = run("git", "checkout", "--ours", "data/jobs.json")
        if c.returncode != 0:
            print("冲突无法自动处理，请把本窗口截图发给贾维斯。")
            print(tailout(r, 400))
            run("git", "rebase", "--abort")
            return 1
        clean_data()
        # rebase 期间：ours = 远程已落地的内容，theirs = 正在应用的本地提交。
        # 云端每 3 小时也会重算密文，撞车时一律保留本地这次生成的密文。
        for f in ("public/vault.bin", "public/vault.extra.bin",
                  "public/vault.contacts.bin", "public/vault.stamp",
                  "public/share-jobs.json", "public/share.html"):
            rr = run("git", "checkout", "--theirs", f)
            if rr.returncode == 0:
                run("git", "add", f)
        run("git", "add", "data/jobs.json")
        c2 = run("git", "rebase", "--continue")
        if c2.returncode != 0:
            print("合并仍然失败，请把本窗口截图发给贾维斯。")
            print(tailout(c2, 400))
            run("git", "rebase", "--abort")
            return 1
    else:
        print("已是最新，无需合并。")

    print("[3/4] 推送到 GitHub ...")
    r = run("git", "push", "origin", "master")
    if r.returncode != 0:
        print("推送失败：", tailout(r, 500))
        return 1

    print("[4/4] 推送成功！")
    print("Vercel 大约 2-5 分钟后自动部署到 https://xmstores.com")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
