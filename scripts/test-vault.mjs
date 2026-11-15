// 回归测试：完全用浏览器同款 WebCrypto 走一遍解锁流程，两份密文都要能解开并合并。
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
  if(wk[0] !== "v1") throw new Error("密钥版本不匹配");

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

  async function dec(name){
    const p = read(name).trim().split(".");
    if(p.length!==4 || p[0]!=="v2") throw new Error(name + " 版本不匹配");
    const dk = await crypto.subtle.decrypt({name:"RSA-OAEP"}, privKey, b64(p[1]));
    const key = await crypto.subtle.importKey("raw", dk, "AES-GCM", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(p[2])}, key, b64(p[3]));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  const mainData = await dec("public/vault.bin");
  const extra = existsSync(join(ROOT, "public/vault.extra.bin")) ? await dec("public/vault.extra.bin") : {jobs:[]};
  // 浏览器里也是这么合并的：补充档案优先覆盖同编号
  const map = new Map();
  for(const j of mainData.jobs) map.set(j.id, j);
  for(const j of (extra.jobs||[])) map.set(j.id, j);
  const jobs = Array.from(map.values());

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

  const count = k => jobs.filter(j => (j.contact_kind||"") === k).length;
  const withContact = jobs.filter(j => (j.contact||"").trim() || (j.url||"").trim()).length;
  const withUrl = jobs.filter(j => (j.url||"").trim()).length;
  const withSalary = jobs.filter(j => (j.salary||"").trim()).length;
  const withZh = jobs.filter(j => (j.title_zh||"").trim()).length;

  console.log("✅ 主档案 " + mainData.jobs.length + " 条 + 补充档案 " + (extra.jobs||[]).length +
              " 条 → 合并 " + jobs.length + " 条 · 更新于 " + mainData.updated);
  console.log("   ✅ 可直接联系 " + count("direct") + " 条 · 站内私信 " + count("dm") +
              " 条 · 原帖 " + count("link") + " 条 · 平台投标 " + count("platform") + " 条");
  console.log("   有联系方式/原帖：" + withContact + " · 有原帖链接：" + withUrl +
              " · 有金额：" + withSalary + " · 有中文标题：" + withZh);
  console.log((wrongBlocked ? "✅" : "❌") + " 错误密码：" + (wrongBlocked ? "已被拒绝" : "竟然能解开，有严重问题"));
  if(!wrongBlocked || !count("direct")) process.exit(1);

  const html = read("public/vault.html");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if(!m) throw new Error("页面里没找到脚本");
  new Function(m[1]);
  console.log("✅ 页面脚本语法检查通过");
}
main().catch(e => { console.error("❌ 测试失败：", e.message); process.exit(1); });
