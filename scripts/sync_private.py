# -*- coding: utf-8 -*-
"""从你的私有 GitHub 仓库同步私人岗位数据（jobs-private.json）。

背景：网站岗位由 GitHub Actions 每 3 小时自动更新，
私人数据（联系方式+真实价）会同步推到你的「私有仓库」——只有你能看。
双击「同步私人数据.bat」即可把最新私人数据拉回本机查档台。

首次使用会要你粘贴一次带令牌的仓库地址（存在 data/sync-url.txt，只在本机）。
"""
import json
import os
import shutil
import subprocess
import tempfile

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL_FILE = os.path.join(BASE, "data", "sync-url.txt")
DEST = os.path.join(BASE, "data", "jobs-private.json")


def run(*args):
    return subprocess.run(args, capture_output=True, text=True)


def main():
    if not os.path.exists(URL_FILE):
        print("=" * 50)
        print("首次使用：粘贴你的私有仓库地址（带令牌）")
        print("格式：https://x-access-token:令牌@github.com/你的用户名/jobs-private.git")
        print("=" * 50)
        url = input("> ").strip()
        if not url or "github.com" not in url:
            print("地址不对，退出。")
            return
        os.makedirs(os.path.dirname(URL_FILE), exist_ok=True)
        with open(URL_FILE, "w", encoding="utf-8") as f:
            f.write(url)
        print("已保存（只在本机，不会上传）。\n")
    else:
        url = open(URL_FILE, encoding="utf-8").read().strip()

    tmp = tempfile.mkdtemp()
    r = run("git", "clone", "--depth", "1", url, os.path.join(tmp, "repo"))
    if r.returncode != 0:
        print("拉取失败：", (r.stderr or r.stdout or "")[:400])
        return
    src = os.path.join(tmp, "repo", "jobs-private.json")
    if not os.path.exists(src):
        print("私有仓库里还没有数据——等自动任务跑一次（每 3 小时）就有了。")
        return
    shutil.copy(src, DEST)
    try:
        d = json.load(open(DEST, encoding="utf-8"))
        print("同步成功：%d 条私人数据（更新于 %s）" % (d.get("count", 0), d.get("updated", "?")))
        print("打开「私人查档台.bat」即可查询。")
    except Exception as e:
        print("数据文件异常：", e)


if __name__ == "__main__":
    main()
