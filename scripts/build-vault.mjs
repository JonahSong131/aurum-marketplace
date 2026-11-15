// 把内部岗位档案加密成 public/vault.bin —— 密文可以安全地放在公开网站上。
//
// 为什么用「公钥加密」：GitHub 自动更新流程在云端跑，它拿不到你的访问密码。
// 所以它用公开的 vault.pub 加密每次的临时数据密钥，你用密码解开 vault.key
// 里的私钥后，才能解开数据。云端全程不需要任何密码/秘钥配置，全自动。
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
const PUB = join(ROOT, "public", "vault.pub");
const KEY = join(ROOT, "public", "vault.key");
const OUT = join(ROOT, "public", "vault.bin");
const STAMP = join(ROOT, "public", "vault.stamp");

const today = new Date().toISOString().slice(0, 10);
if (process.env.FORCE_VAULT !== "1" && existsSync(STAMP) && readFileSync(STAMP, "utf8").trim() === today) {
  console.log("[vault] 今天已更新过，跳过（FORCE_VAULT=1 可强制）");
  process.exit(0);
}
for (const [p, label] of [[SRC, "私人数据"], [PUB, "公钥"], [KEY, "加密私钥"]]) {
  if (!existsSync(p)) {
    console.error("[vault] 缺少" + label + "：" + p + " —— 先跑 init-vault-key.mjs 和岗位抓取");
    process.exit(1);
  }
}

const json = readFileSync(SRC, "utf8");
const parsed = JSON.parse(json);
const count = Array.isArray(parsed.jobs) ? parsed.jobs.length : 0;
if (!count) {
  console.error("[vault] 私人数据为空，拒绝覆盖已有密文");
  process.exit(1);
}

// 每次用一把全新的临时密钥加密数据，再用公钥把它包起来
const dk = randomBytes(32);
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", dk, iv);
const body = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
const payload = Buffer.concat([body, cipher.getAuthTag()]);
const encDK = publicEncrypt(
  { key: readFileSync(PUB, "utf8"), padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
  dk
);

// 格式：v2.<被公钥包住的临时密钥>.<iv>.<密文+tag>
const blob = ["v2", encDK.toString("base64"), iv.toString("base64"), payload.toString("base64")].join(".");
writeFileSync(OUT, blob, "utf8");
writeFileSync(STAMP, today, "utf8");

console.log(
  "[vault] 已加密 " + count + " 条 → public/vault.bin (" +
  (statSync(OUT).size / 1024).toFixed(0) + " KB) · 数据更新于 " + (parsed.updated || "未知")
);
