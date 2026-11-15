// 回归测试：完全用浏览器同款 WebCrypto 走一遍解锁流程，确认密文能被密码解开。
// 用法：node scripts/test-vault.mjs
import { readFileSync, existsSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const crypto = webcrypto;
const ITER = 310000;
const read = p => readFileSync(join(ROOT, p), "utf8");
const b64 = s => { const bin = Buffer.from(s, "base64"); return new Uint8Array(bin); };

function pemToDer(pem){ return b64(pem.replace(/-----[^-]+-----/g,"").replace(/\s+/g,"")); }

async function main(){
  const pw = (process.env.PRIVATE_VAULT_PASSWORD || read("data/vault-password.txt")).trim();
  const wk = read("public/vault.key").trim().split(".");
  const parts = read("public/vault.bin").trim().split(".");
  if(wk[0] !== "v1" || parts[0] !== "v2") throw new Error("版本不匹配");

  const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
  const kek = await crypto.subtle.deriveKey(
    {name:"PBKDF2", salt:b64(wk[1]), iterations:ITER, hash:"SHA-256"},
    km, {name:"AES-GCM", length:256}, false, ["decrypt"]
  );
  const privPem = new TextDecoder().decode(
    await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(wk[2])}, kek, b64(wk[3]))
  );
  const privKey = await crypto.subtle.importKey(
    "pkcs8", pemToDer(privPem), {name:"RSA-OAEP", hash:"SHA-256"}, false, ["decrypt"]
  );
  const dk = await crypto.subtle.decrypt({name:"RSA-OAEP"}, privKey, b64(parts[1]));
  const aesKey = await crypto.subtle.importKey("raw", dk, "AES-GCM", false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(parts[2])}, aesKey, b64(parts[3]));
  const data = JSON.parse(new TextDecoder().decode(plain));

  // 错误密码必须解不开
  let wrongBlocked = false;
  try{
    const badKm = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw+"x"), "PBKDF2", false, ["deriveKey"]);
    const badKek = await crypto.subtle.deriveKey(
      {name:"PBKDF2", salt:b64(wk[1]), iterations:ITER, hash:"SHA-256"},
      badKm, {name:"AES-GCM", length:256}, false, ["decrypt"]
    );
    await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(wk[2])}, badKek, b64(wk[3]));
  }catch(e){ wrongBlocked = true; }

  const withContact = data.jobs.filter(j => (j.contact||"").trim() || (j.url||"").trim()).length;
  const withUrl = data.jobs.filter(j => (j.url||"").trim()).length;
  const withSalary = data.jobs.filter(j => (j.salary||"").trim()).length;
  const withZh = data.jobs.filter(j => (j.title_zh||"").trim()).length;

  console.log("✅ 解锁成功：" + data.jobs.length + " 条 · 更新于 " + data.updated);
  console.log("   有联系方式/原帖：" + withContact + " · 有原帖链接：" + withUrl +
              " · 有金额：" + withSalary + " · 有中文标题：" + withZh);
  console.log("   第一条：" + data.jobs[0].id + " / " + (data.jobs[0].title_zh || data.jobs[0].title));
  console.log((wrongBlocked ? "✅" : "❌") + " 错误密码：" + (wrongBlocked ? "已被拒绝" : "竟然能解开，有严重问题"));
  if(!wrongBlocked) process.exit(1);

  // 顺手检查页面脚本语法
  const html = read("public/vault.html");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if(!m) throw new Error("页面里没找到脚本");
  new Function(m[1]);
  console.log("✅ 页面脚本语法检查通过");
}
main().catch(e => { console.error("❌ 测试失败：", e.message); process.exit(1); });
