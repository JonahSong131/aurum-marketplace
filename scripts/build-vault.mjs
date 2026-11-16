// 把内部岗位档案加密成 public/vault.bin，另外把「可直接联系」的岗位单独加密成
// public/vault.extra.bin。密文可以安全地放在公开网站上。
//
// 为什么用「公钥加密」：GitHub 自动更新流程在云端跑，它拿不到你的访问密码。
// 所以它用公开的 vault.pub 加密每次的临时数据密钥，你用密码解开 vault.key
// 里的私钥后，才能解开数据。云端全程不需要任何密码/秘钥配置，全自动。
//
// 为什么要两份密文：主档案由云端每天重抓重加密；补充档案来自本机的
// 扩展岗位信息，云端没有那份源数据，所以保留仓库里已有的密文不动，
// 浏览器把两份解出来合并显示 —— 这样「可直接联系」那批永远不会被冲掉。
//
// 用法：node scripts/build-vault.mjs
//       FORCE_VAULT=1 node scripts/build-vault.mjs   （忽略每日节流，强制重加密）
//
// 每天最多重加密一次，避免密文把 git 仓库撑大。

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { publicEncrypt, constants, randomBytes, createCipheriv } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "data", "jobs-private.json");
const EXTRA_SRC = join(ROOT, "data", "jobs-contacts.json");
const PUB = join(ROOT, "public", "vault.pub");
const KEY = join(ROOT, "public", "vault.key");
const OUT = join(ROOT, "public", "vault.bin");
const EXTRA_OUT = join(ROOT, "public", "vault.extra.bin");
// 首屏专用：只有「可直接联系」那一小份，约 100KB，弱网几秒就能打开
const CONTACTS_OUT = join(ROOT, "public", "vault.contacts.bin");
const STAMP = join(ROOT, "public", "vault.stamp");

const today = new Date().toISOString().slice(0, 10);
if (process.env.FORCE_VAULT !== "1" && existsSync(STAMP) && readFileSync(STAMP, "utf8").trim() === today) {
  console.log("[vault] 今天已更新过，跳过（FORCE_VAULT=1 可强制）");
  process.exit(0);
}
for (const [p, label] of [[SRC, "内部档案"], [PUB, "公钥"], [KEY, "加密私钥"]]) {
  if (!existsSync(p)) {
    console.error("[vault] 缺少" + label + "：" + p + " —— 先跑 init-vault-key.mjs 和岗位抓取");
    process.exit(1);
  }
}

const pubPem = readFileSync(PUB, "utf8");

function encryptText(json, out, label) {
  const parsed = JSON.parse(json);
  const count = Array.isArray(parsed.jobs) ? parsed.jobs.length : 0;
  if (!count) {
    console.log("[vault] " + label + "为空，跳过，保留原有密文");
    return;
  }
  // 每次用一把全新的临时密钥加密数据，再用公钥把它包起来
  const dk = randomBytes(32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", dk, iv);
  const body = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  const payload = Buffer.concat([body, cipher.getAuthTag()]);
  const encDK = publicEncrypt(
    { key: pubPem, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    dk
  );
  // 格式：v2.<被公钥包住的临时密钥>.<iv>.<密文+tag>
  writeFileSync(out, ["v2", encDK.toString("base64"), iv.toString("base64"), payload.toString("base64")].join("."), "utf8");
  console.log("[vault] " + label + " " + count + " 条 → " + out.split(/[\\/]/).pop() +
              " (" + (statSync(out).size / 1024).toFixed(0) + " KB)");
}

function encryptFile(src, out, label) {
  // 紧凑序列化，去掉本地文件里的缩进空白，减小密文体积
  encryptText(JSON.stringify(JSON.parse(readFileSync(src, "utf8"))), out, label);
}

encryptFile(SRC, OUT, "主档案");
if (existsSync(EXTRA_SRC)) {
  const d = JSON.parse(readFileSync(EXTRA_SRC, "utf8"));
  const direct = (d.jobs || []).filter(j => (j.contact_kind || "") === "direct");
  if (direct.length) {
    encryptText(JSON.stringify({ updated: d.updated, count: direct.length, jobs: direct }),
                CONTACTS_OUT, "首屏直达档案");
  }
  encryptFile(EXTRA_SRC, EXTRA_OUT, "补充档案");
} else {
  console.log("[vault] 本机没有补充档案源数据，保留仓库里已有的补充密文");
}
writeFileSync(STAMP, today, "utf8");
