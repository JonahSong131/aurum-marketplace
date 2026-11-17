# -*- coding: utf-8 -*-
"""立刻刷新加密资料库：抓最新内部档案 → 重新加密 → 本地验证 → 推送上线。

平时不用点（GitHub 每天会自动更新一次）。只有在客户报了一个很新的岗位编号、
而你这边还没查到时，双击「立刻更新资料库.bat」马上补齐。
"""
import os
import subprocess
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE)


def run(*args, env=None, check=True):
    e = os.environ.copy()
    e["GIT_EDITOR"] = "true"
    if env:
        e.update(env)
    r = subprocess.run(args, text=True, encoding="utf-8", errors="replace", env=e)
    if check and r.returncode != 0:
        print("步骤失败：", " ".join(args))
        sys.exit(1)
    return r


def main():
    print("[1/6] 检查密钥 ...")
    if not (os.path.exists("public/vault.pub") and os.path.exists("public/vault.key")):
        run("node", "scripts/init-vault-key.mjs")

    print("[2/6] 抓取最新岗位（只更新内部档案，不会动网站上的中文内容）...")
    run("python", "scripts/fetch_jobs.py", env={"PRIVATE_ONLY": "1"})

    print("[2.5] 重新提取联系方式，并入扩展岗位档案 ...")
    run("python", "scripts/merge_radar_contacts.py", env={"RESET_CONTACTS": "1"})

    print("[2.7] 重建对外分享页数据（脱敏）...")
    run("python", "scripts/build-share.py")

    print("[3/6] 重新加密 ...")
    run("node", "scripts/build-vault.mjs", env={"FORCE_VAULT": "1"})

    print("[4/6] 验证密文能正常解锁 ...")
    run("node", "scripts/test-vault.mjs")

    print("[5/6] 提交密文 ...")
    run("git", "add", "public/vault.bin", "public/vault.extra.bin",
        "public/vault.contacts.bin", "public/vault.stamp",
        "public/vault.key", "public/vault.pub",
        "public/share-jobs.json", "public/share.html")
    if run("git", "diff", "--cached", "--quiet", check=False).returncode != 0:
        run("git", "commit", "-m", "chore: 刷新加密资料库")
    else:
        print("数据没变化，跳过提交")

    print("[6/6] 同步并推送 ...")
    import publish
    rc = publish.main()
    if rc == 0:
        print("\n完成！打开 https://xmstores.com/vault.html 输入密码即可查看最新数据。")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
