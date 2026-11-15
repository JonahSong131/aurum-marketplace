// 一次性生成资料库密钥对（只需跑一次，之后不要再跑，除非要换密码）
//   公钥 public/vault.pub  —— 公开，自动更新流程用它加密数据，别人拿到也没用
//   私钥 public/vault.key  —— 已用访问密码加过密的私钥，别人拿到也解不开
// 密码只从 PRIVATE_VAULT_PASSWORD 或本地 data/vault-password.txt 读取。
//
// 这样 GitHub 自动更新时不需要任何密钥/秘钥配置：它拿公钥加密，你用密码解开。

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { generateKeyPairSync, pbkdf2Sync, randomBytes, createCipheriv } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PWFILE = join(ROOT, "data", "vault-password.txt");
const PUB = join(ROOT, "public", "vault.pub");
const KEY = join(ROOT, "public", "vault.key");
const ITERATIONS = 310000;

const password = (process.env.PRIVATE_VAULT_PASSWORD || "").trim() ||
  (existsSync(PWFILE) ? readFileSync(PWFILE, "utf8").trim() : "");
if (!password) {
  console.error("[vault] 缺少访问密码");
  process.exit(1);
}
if (existsSync(PUB) && existsSync(KEY) && process.env.FORCE_VAULT_KEY !== "1") {
  console.log("[vault] 密钥已存在，跳过（要重新生成请设 FORCE_VAULT_KEY=1）");
  process.exit(0);
}

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pubPem = publicKey.export({ type: "spki", format: "pem" });
const privPem = privateKey.export({ type: "pkcs8", format: "pem" });

const salt = randomBytes(16), iv = randomBytes(12);
const kek = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
const c = createCipheriv("aes-256-gcm", kek, iv);
const body = Buffer.concat([c.update(privPem, "utf8"), c.final()]);
const wrapped = Buffer.concat([body, c.getAuthTag()]);
// 格式：v1.<salt>.<iv>.<加密后的私钥+tag>
const blob = ["v1", salt.toString("base64"), iv.toString("base64"), wrapped.toString("base64")].join(".");

writeFileSync(PUB, pubPem, "utf8");
writeFileSync(KEY, blob, "utf8");
console.log("[vault] 密钥对已生成：" + "public/vault.pub（公开） + public/vault.key（密码加锁）");
console.log("[vault] 注意：换了访问密码必须重新跑一次本脚本（FORCE_VAULT_KEY=1），旧密文会失效");
