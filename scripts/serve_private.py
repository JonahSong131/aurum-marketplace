# -*- coding: utf-8 -*-
"""私人查档台：只在本机 127.0.0.1:8877 打开，别人访问不到。

用法：双击「私人查档台.bat」，浏览器会自动打开 http://127.0.0.1:8877
数据源：data/jobs-private.json（含联系方式和原帖链接，绝不上传 GitHub）
数据由「更新岗位数据.bat」刷新（跑 scripts/fetch_jobs.py）。
"""
import json
import os
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRIV = os.path.join(BASE, "data", "jobs-private.json")
PORT = 8877

HTML = """<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>私人查档台 · 锦市 Jobs</title>
<meta name="robots" content="noindex,nofollow">
<style>
 body{background:#0c0d10;color:#ece6d8;font-family:system-ui,sans-serif;margin:0;padding:24px}
 h1{font-size:20px;color:#ddc78c;margin:0 0 4px}
 .sub{color:#888;font-size:12px;margin-bottom:16px}
 input{width:100%;max-width:560px;padding:10px 14px;font-size:15px;border-radius:10px;
   border:1px solid #333;background:#16181f;color:#ece6d8;box-sizing:border-box}
 .card{border:1px solid #2a2c36;background:#14161d;border-radius:12px;padding:14px 16px;margin:10px 0}
 .t{font-size:15px;font-weight:600;color:#f5edd9}
 .m{font-size:12px;color:#9a958a;margin-top:4px}
 a{color:#ddc78c}
 .url{font-size:12px;word-break:break-all;margin-top:6px}
 .desc{font-size:12px;color:#b8b2a5;white-space:pre-line;margin-top:8px;max-height:220px;overflow:auto}
 .hit{color:#ddc78c;font-weight:600}
 .count{font-size:12px;color:#777;margin:12px 0}
</style></head><body>
<h1>私人查档台（仅本机可见）</h1>
<div class="sub">客户报岗位编号或标题关键词 → 这里查出联系方式和原帖。<span class="hit">报价 = 真实价 ×0.8，差价 20% 是你的利润</span>。数据不在公开网站上。</div>
<input id="q" placeholder="输入岗位编号（如 3f8a2c1b9d04）或标题关键词 / 分类 / Telegram …" autofocus>
<div class="count" id="cnt"></div><div id="list"></div>
<script>
let ALL=[];
fetch('/api/private').then(r=>r.json()).then(d=>{ALL=d.jobs||[];document.getElementById('cnt').textContent='共 '+ALL.length+' 条 · 更新于 '+new Date(d.updated).toLocaleString();render('');});
const q=document.getElementById('q');
q.addEventListener('input',()=>render(q.value.trim()));
function esc(s){return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function render(kw){
 const list=document.getElementById('list');
 if(!kw){list.innerHTML='';return}
 const k=kw.toLowerCase();
 const hits=ALL.filter(j=>(j.id+' '+j.title+' '+j.desc+' '+j.source+' '+j.cat).toLowerCase().includes(k)).slice(0,40);
 list.innerHTML=hits.map(j=>'<div class="card"><div class="t">'+esc(j.title)+
  ' <span class="hit">#'+j.id+'</span></div><div class="m">'+esc(j.source)+' · '+
  new Date(j.published).toLocaleString()+
  (j.salary?' · 真实价 '+esc(j.salary):'')+
  (j.quote?' · <span class="hit">对外报价 '+esc(j.quote)+'</span>':'')+
  ' · '+esc(j.cat)+'</div>'+
  (j.url?'<div class="url">原帖：<a href="'+esc(j.url)+'" target="_blank">'+esc(j.url)+'</a></div>':'')+
  '<div class="desc">'+esc(j.desc)+'</div></div>').join('')||'<div class="m">没查到。先双击「更新岗位数据.bat」刷新，或让客户发完整标题。</div>';
}
</script></body></html>"""


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype):
        b = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        p = urllib.parse.urlparse(self.path)
        if p.path in ("/", "/index.html"):
            self._send(200, HTML, "text/html; charset=utf-8")
            return
        if p.path == "/api/private":
            try:
                with open(PRIV, encoding="utf-8") as f:
                    self._send(200, f.read(), "application/json; charset=utf-8")
            except Exception as e:
                self._send(500, json.dumps({"error": str(e)}), "application/json")
            return
        self._send(404, "nope", "text/plain")


if __name__ == "__main__":
    # 只绑 127.0.0.1：家里其他设备、外网都访问不到，只有这台电脑能开
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    print("私人查档台已启动：http://127.0.0.1:%d （Ctrl+C 关闭）" % PORT)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("已停止")
