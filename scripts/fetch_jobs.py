# -*- coding: utf-8 -*-
"""自动抓社媒上的海外线上岗位 → data/jobs.json → 网站展示。

设计要点：
- 纯 Python 标准库，零依赖。GitHub Actions 的海外服务器直接跑，
  不需要代理（Reddit 存档接口 / Telegram 公开页 / Freelancer 接口都是公开的）。
- 每个岗位都带发布时间和分类，7 天以外的丢弃。
- 不保存原帖联系方式——网站上求职者只能加微信，撮合由站主做。
- 输出按发布时间倒序，最多 400 条。

本地测试：python scripts/fetch_jobs.py
"""
import hashlib
import html as htmllib
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone, timedelta

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "jobs.json")
MAX_AGE_DAYS = 7
MAX_ITEMS = 600

HERE = os.path.dirname(os.path.abspath(__file__))


def _make_opener(proxy):
    ph = urllib.request.ProxyHandler({"http": proxy, "https": proxy} if proxy else {})
    return urllib.request.build_opener(ph)


_OPENERS = None


def get_openers():
    """出口顺序：直连 → 本机 Clash → 环境变量代理。
    GitHub Actions 在海外，直连一次就成；本地跑的时候 t.me 要走 Clash。"""
    global _OPENERS
    if _OPENERS is None:
        cands = [None, "http://127.0.0.1:7890"]
        env = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") \
            or os.environ.get("HTTP_PROXY") or os.environ.get("http_proxy")
        if env:
            cands.append(env)
        seen, out = set(), []
        for p in cands:
            if p in seen:
                continue
            seen.add(p)
            try:
                out.append((p, _make_opener(p)))
            except Exception:
                pass
        _OPENERS = out
    return _OPENERS


def http_get(url, timeout=30, headers=None):
    h = {"User-Agent": UA, "Accept": "*/*", "Accept-Language": "en-US,en;q=0.9"}
    h.update(headers or {})
    last = None
    for proxy, opener in get_openers():
        try:
            req = urllib.request.Request(url, headers=h)
            with opener.open(req, timeout=timeout) as r:
                raw = r.read()
            return raw.decode("utf-8", errors="replace")
        except Exception as e:
            last = e
            time.sleep(1.5)
    raise last or RuntimeError("fetch failed: " + url)


# ---------------------------------------------------------------- 过滤规则

# 自荐帖：发帖人是「我接活」，不是招人，网站上放这些没有意义
RE_SELF = re.compile(
    r"(\[for\s*hire\]|\[forhire\]|\bhire\s+me\b|\bi\s+am\s+available\b|"
    r"\bavailable\s+for\s+(work|hire|freelance)\b|\bmy\s+services\b|"
    r"\bopen\s+to\s+(work|freelance|opportunities)\b|"
    r"\blooking\s+for\s+(work|a\s+job|clients|projects)\b|"
    r"接单|承接|我能做|提供服务)", re.I)

# 广告/垃圾：卖工具、卖课、拉群
RE_AD = re.compile(
    r"(\[for\s*hire\]|we\s+offer|our\s+service|our\s+tool|our\s+platform|dm\s+us|"
    r"book\s+a\s+(demo|call)|free\s+trial|sign\s+up\s+now|\d+\s*%\s*off|discount|"
    r"limited\s+time|trusted\s+brand|endorsed\s+by|struggling\s+to\s+find\s+clients|"
    r"link\s+in\s+bio|comment\s+[\"']?link|affiliat(e|ion))", re.I)

# 必须像一条岗位/活儿
RE_JOBISH = re.compile(
    r"(\[hiring\]|\[task\]|\[offer\]|hiring|looking\s+for\s+(a|an|someone|people|freelanc)|"
    r"need\s+(a|an|someone)|job|vacanc|position|role|opening|recruit|заявк|ваканс|"
    r"应聘|招聘|诚聘|急聘|直招)", re.I)

RE_WEB3 = re.compile(
    r"(crypto|web3|blockchain|usdt|defi|nft|binance|okx|bybit|kucoin|token|"
    r"币圈|交易所|链上|数字货币|合约)", re.I)

CAT_RULES = [
    ("web3", re.compile(r"(crypto|web3|blockchain|usdt|defi|nft|binance|okx|token|交易所|币圈|链上|量化|风控|otc)", re.I)),
    ("tech", re.compile(r"(developer|engineer|programmer|full[- ]?stack|frontend|backend|devops|mlops|python|javascript|typescript|react|node|php|java\b|golang|rust|c\+\+|sql|api\b|机器学习|算法|程序员|开发|软件工程师|运维|测试)", re.I)),
    ("design", re.compile(r"(design(er)?|ui\b|ux\b|figma|logo|video\s*edit|reels|premiere|after\s*effects|photoshop|illustrat|motion|3d\s*model|thumbnail|graphic|剪辑|视频制作|设计师|美工|建模)", re.I)),
    ("marketing", re.compile(r"(marketing|seo\b|smm\b|social\s*media|ads\b|advertis|growth|campaign|content\s*strateg|influencer|tiktok|instagram|facebook\s*ads|marketing|运营|推广|社媒|投放|主播|带货|直播)", re.I)),
    ("support", re.compile(r"(customer\s*(support|service)|support\s*(agent|specialist)|chat\s*support|help\s*desk|call\s*center|virtual\s*assistant|va\b|moderator|community\s*manager|客服|在线客服|售后|运营助理|telegram\s*support)", re.I)),
    ("writing", re.compile(r"(writer|writing|copywrit|translat|proofread|blog|article|editor\b|script\s*write|документ|writer|文案|写作|翻译|笔译|口译|字幕)", re.I)),
    ("data", re.compile(r"(data\s*entry|scraping|web\s*scrap|excel|spreadsheet|research|lead\s*generation|transcri|typing|录入|数据|爬虫|采集|调研)", re.I)),
]

# 薪资提取：符号前缀 / 货币词前缀 / 中文 / 货币词后缀 / 带单位 / 区间
_MONEY_UNIT = r"(?:\s?(?:k\b|/hr|/hour|per\s*hour|/mo|/month|per\s*month|/day|per\s*day|/task|per\s*task))?"
RE_MONEY = re.compile(
    r"[$€£₱₽]\s?\d[\d,.]*(?:\s?[-–~]\s?[$€£₱₽]?\s?\d[\d,.]*)?" + _MONEY_UNIT
    + r"|(?<![A-Za-z])(?:USD|EUR|GBP|PHP|RM)\s?\d[\d,.]*(?:\s?[-–~]\s?(?:(?<![A-Za-z])(?:USD|EUR|GBP|PHP|RM)\s?)?\d[\d,.]*)?" + _MONEY_UNIT
    + r"|(?:佣金|月薪|时薪|日薪|周薪)\s?\d[\d,.]*(?:\s?[-–~]\s?\d[\d,.]*)?" + _MONEY_UNIT
    + r"|\d[\d,.]*\s?(?:USD|usd|PHP|php|EUR|eur)\b"
    + r"|\d[\d,.]*\s?[-–~]\s?\d[\d,.]*\s?(?:USD|usd|PHP|php|EUR|eur)\b",
    re.I)

# 没写具体数、但明说"面议"的
RE_NEGOT = re.compile(r"薪资[:：\s]*(?:面议|negotiable)|salary[^.\n]{0,20}negotiable", re.I)

RE_REMOTE = re.compile(r"(remote|work\s*from\s*home|anywhere|wfh|远程|在家办公|線上|线上)", re.I)
# ============================================================
# 公开版清洗：联系方式一个都不能漏出去。
# 清洗顺序：URL → 邮箱 → @账号 → 电话 → 明示联系句式。
# ============================================================
SCRUB_PATTERNS = [
    # 1) 一切链接（原帖、t.me、wa.me、chat.whatsapp.com、freelancer 项目页……；含被截断的裸 https:// ）
    (re.compile(r"(https?://\S*|(?<![\w./])www\.\S*|(?:t|chat)\.me/\S*|chat\.whatsapp\.com/\S*|wa\.me/\S*)", re.I), " "),
    # 2) 邮箱
    (re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b"), " "),
    # 3) @账号（Telegram / X 句柄）
    (re.compile(r"(?<![A-Za-z0-9_])@[A-Za-z0-9_]{3,31}\b"), " "),
    # 4) 电话号（7 位以上、允许空格横杠括号；$ 开头的工资数字不受影响）
    (re.compile(r"(?<![\d$.])\+?\d[\d\s\-().]{6,16}\d(?![\d%])"), " "),
]
# 5) 明示联系句式：「WhatsApp: xxx」「微信 xxx」「dm me」——直接删除，不留任何痕迹
SCRUB_PHRASE = re.compile(
    r"((?:whatsapp|telegram|tg|wechat|weixin|vx|微信)\s*(?:号|id|username)?\s*[:：=]\s*[^\n，。,]{2,30}"
    r"|dm\s+me|pm\s+me|message\s+me|add\s+me|加我\w{0,4}|私信\w{0,2}|联系我|联系\s*方式)", re.I)
SCRUB_FILLER = ""


def scrub(text):
    """把一段文字里所有能直接联系到发帖人的东西抹掉"""
    t = text or ""
    for pat, rep in SCRUB_PATTERNS:
        t = pat.sub(rep, t)
    t = SCRUB_PHRASE.sub(SCRUB_FILLER, t)
    if SCRUB_FILLER:
        # 占位符出现多次只留一个，别刷屏
        t = re.sub(re.escape(SCRUB_FILLER) + r"(?:\s*" + re.escape(SCRUB_FILLER) + r")+", SCRUB_FILLER, t)
    t = re.sub(r"[ \t]{2,}", " ", t)
    t = re.sub(r"\n\s*\n\s*\n+", "\n\n", t)
    return t.strip()




# ============================================================
# 站主利润规则：对外统一少报 20%（差价是站主利润）。
# 公开版里一切"钱"（薪资字段、标题、描述里的价格）一律 ×0.8；
# 私人版保留真实价，另加 quote 字段 = 对外建议报价。
# ============================================================
PROFIT_RATE = 0.8


def _scale_nums(seg):
    """把一段文本里的所有数字 ×0.8（千分位/小数保持原样格式）"""
    def repl(m):
        n = m.group(0)
        try:
            v = float(n.replace(",", "")) * PROFIT_RATE
        except ValueError:
            return n
        had_comma = "," in n
        if "." in n:
            s = ("%.1f" % v).rstrip("0").rstrip(".")
        else:
            s = str(int(round(v)))
        if had_comma:
            try:
                if "." in s:
                    whole, frac = s.split(".")
                    s = "{:,}.{}".format(int(whole), frac)
                else:
                    s = "{:,}".format(int(s))
            except ValueError:
                pass
        return s
    return re.sub(r"\d+(?:,\d{3})*(?:\.\d+)?|\d+", repl, seg)


def discount_salary(s):
    """薪资字段整体打折：'USD 5000-10000' → 'USD 4000-8000'"""
    return _scale_nums(s) if s else s


# 描述/标题里的价格表达式（带货币前缀 + 可选区间 + 可选单位后缀）
_NUM = r"\d+(?:,\d{3})*(?:\.\d+)?"
RE_MONEY_EXPR = re.compile(
    r"(?<![A-Za-z0-9])(?:USD|RM)\s?" + _NUM + r"(?:\s?[-–~]\s?" + _NUM + r")?"
    r"|[$€£₱₽]\s?" + _NUM + r"(?:\s?[-–~]\s?" + _NUM + r")?"
    r"|(?:佣金|月薪|时薪|日薪)\s?" + _NUM + r"(?:\s?[-–~]\s?" + _NUM + r")?"
    r"|\$\d[\d,.]*k\b"
    r"|(?<![A-Za-z0-9])" + _NUM + r"(?:\s?[-–~]\s?" + _NUM + r")?\s?(?:USD|EUR|GBP|RMB|CNY)\b", re.I)


def discount_money_text(t):
    """标题/描述里的价格打折：只动带货币上下文的数字，普通数字（年限、数量）不动"""
    if not t:
        return t
    return RE_MONEY_EXPR.sub(lambda m: _scale_nums(m.group(0)), t)


# ---------------------------------------------------------------- 中文翻译
# 面向中国求职者：标题和描述全部翻成中文。
# 用免费无密钥的 Google 翻译端点（client=gtx），按文本哈希缓存，
# 中文内容自动跳过，翻译失败保留原文（下轮重试）。
T_SEP = "@@@"
T_CACHE_PATH = os.path.join(os.path.dirname(OUT), "translate-cache.json")
_T_CACHE = None


def _tcache():
    global _T_CACHE
    if _T_CACHE is None:
        try:
            _T_CACHE = json.load(open(T_CACHE_PATH, encoding="utf-8"))
        except Exception:
            _T_CACHE = {}
    return _T_CACHE


def _tcache_save():
    os.makedirs(os.path.dirname(T_CACHE_PATH), exist_ok=True)
    tmp = T_CACHE_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(_T_CACHE, f, ensure_ascii=False)
    os.replace(tmp, T_CACHE_PATH)


def _is_zh(s):
    """CJK 字符占比高的就算已是中文，不用翻"""
    if not s:
        return True
    letters = sum(1 for ch in s if ch.isalpha())
    cjk = sum(1 for ch in s if "\u4e00" <= ch <= "\u9fff")
    if letters == 0:
        return cjk > 0
    return cjk / letters > 0.4


def _gtx_request(q):
    data = urllib.parse.urlencode({"q": q, "client": "gtx", "sl": "auto", "tl": "zh-CN", "dt": "t"})
    req = urllib.request.Request(
        "https://translate.googleapis.com/translate_a/single",
        data=data.encode("utf-8"),
        headers={"User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded"})
    last = None
    for proxy, opener in get_openers():
        try:
            with opener.open(req, timeout=25) as r:
                d = json.loads(r.read().decode("utf-8", errors="replace"))
            return "".join(seg[0] for seg in d[0] if seg and seg[0])
        except Exception as e:
            last = e
            time.sleep(0.8)
    raise last or RuntimeError("translate failed")


def translate_texts(texts, label=""):
    """批量中文化。返回与 texts 等长的新列表；已是中文/缓存命中的不请求。"""
    cache = _tcache()
    out = list(texts)
    todo = []  # (index, text)
    for i, t in enumerate(texts):
        if not t or _is_zh(t):
            continue
        k = hashlib.sha1(t.encode("utf-8")).hexdigest()[:16]
        if k in cache:
            out[i] = cache[k]
        else:
            todo.append((i, t))
    if not todo:
        return out

    # 按字符量分批（每批不超过 ~2200 字符，避免请求过长）
    batches, cur, cur_len = [], [], 0
    for i, t in todo:
        if cur and cur_len + len(t) > 2200:
            batches.append(cur)
            cur, cur_len = [], 0
        cur.append((i, t))
        cur_len += len(t)
    if cur:
        batches.append(cur)

    print("翻译 %d 段（%d 批）%s …" % (len(todo), len(batches), label))
    for bi, batch in enumerate(batches):
        try:
            joined = T_SEP.join(t for _, t in batch)
            res = _gtx_request(joined)
            parts = res.split(T_SEP)
            if len(parts) != len(batch):
                # 分隔符被改动：逐条降级
                parts = None
                for i, t in batch:
                    try:
                        one = _gtx_request(t)
                        k = hashlib.sha1(t.encode("utf-8")).hexdigest()[:16]
                        cache[k] = one
                        out[i] = one
                    except Exception:
                        pass  # 保留原文，下轮再试
                    time.sleep(0.25)
            else:
                for (i, t), tr in zip(batch, parts):
                    k = hashlib.sha1(t.encode("utf-8")).hexdigest()[:16]
                    cache[k] = tr
                    out[i] = tr
        except Exception as e:
            print("[翻译] 第 %d 批失败（保留原文）: %s" % (bi + 1, str(e)[:60]), file=sys.stderr)
        time.sleep(0.4)
    _tcache_save()
    return out


def classify(text):
    if RE_WEB3.search(text):
        return "web3"
    for cat, pat in CAT_RULES:
        if cat != "web3" and pat.search(text):
            return cat
    return "misc"


def clean_text(s, limit=600):
    s = htmllib.unescape(s or "")
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()[:limit]


def make_job(title, desc, source, source_name, published_dt, url,
             jobish=True, remote_hint=False, salary_hint=""):
    text = title + " " + desc
    if RE_SELF.search(text) or RE_AD.search(text):
        return None
    if jobish and not RE_JOBISH.search(text):
        return None
    m = RE_MONEY.search(text)
    if salary_hint:
        salary = salary_hint
    elif m:
        salary = (m.group(0) or "").strip()
    elif RE_NEGOT.search(text):
        salary = "面议"
    else:
        salary = ""
    remote = remote_hint or bool(RE_REMOTE.search(text))
    cat = classify(text)
    title = clean_text(title, 140)
    if not title:
        return None
    # 指纹带上来源：不同频道的同名帖（如 #PR_специалист）不能被合并掉
    fp = re.sub(r"[^a-z0-9\u4e00-\u9fff]", "", (title.lower() + source_name))[:80]
    jid = hashlib.sha1((fp + cat).encode()).hexdigest()[:12]
    # 私人版：真实价格 + 建议报价（quote = 打过 8 折的对外价）——只写进本地文件，不上传
    private = {
        "id": jid,
        "title": title,
        "desc": clean_text(desc, 1500),
        "cat": cat,
        "source": source_name,
        "url": url or "",
        "published": published_dt.astimezone(timezone.utc).isoformat(timespec="seconds"),
        "salary": salary,
        "quote": discount_salary(salary),
    }
    # 公开版：联系方式全部抹掉；来源不写平台名（写了等于告诉求职者去哪找原帖）
    pub_dt = published_dt.astimezone(timezone.utc).isoformat(timespec="seconds")
    return {
        "id": jid,
        "title": discount_money_text(scrub(title))[:140],
        "desc": discount_money_text(scrub(clean_text(desc, 500))),
        "cat": cat,
        "source": "海外在招",
        "published": pub_dt,
        "salary": discount_salary(salary),
        "remote": remote,
        "web3": cat == "web3",
    }, private


# ---------------------------------------------------------------- 数据源

# 招聘型 Reddit 版块（走 arctic-shift 公开存档，不限流、带时间）
ARCTIC_SUBS = ["hiring", "forhire", "jobbit", "freelance_forhire",
               "DesignJobs", "HireaWriter", "hireanartist", "VideoEditingJobs",
               "jobs4bitcoins", "slavelabour", "Freelancers"]

# Telegram 公开频道
TG_CHANNELS = ["remotejobss", "remote_cn", "RemoteJobsCN", "remotejobboard",
               "cryptojobslist", "web3hiring", "rabota", "vakansii"]

# Freelancer 平台词（真实带预算的项目，可投标）
FL_QUERIES = ["customer support", "virtual assistant", "data entry", "web scraping",
              "translation", "video editing", "chatbot", "whatsapp",
              "social media management", "logo design", "transcription"]


def fetch_arctic():
    out = []
    after = int(time.time()) - MAX_AGE_DAYS * 86400
    for sub in ARCTIC_SUBS:
        try:
            url = ("https://arctic-shift.photon-reddit.com/api/posts/search"
                   "?subreddit=%s&limit=100&sort=desc&after=%d"
                   % (urllib.parse.quote(sub), after))
            d = json.loads(http_get(url, timeout=40))
            for p in d.get("data", []):
                pub = datetime.fromtimestamp(p.get("created_utc") or 0, timezone.utc)
                perm = p.get("permalink") or ""
                j = make_job(p.get("title") or "",
                             p.get("selftext") or "",
                             "reddit", "Reddit · r/" + sub, pub,
                             "https://www.reddit.com" + perm)
                if j:
                    out.append(j)
        except Exception as e:
            print("[arctic:%s] 失败: %s" % (sub, str(e)[:80]), file=sys.stderr)
        time.sleep(1.2)
    return out


# ---------------- 岗位板 API（免费公开，量最大的来源）----------------

def fetch_remoteok():
    """remoteok.com 公开接口：全是远程岗，带薪资和申请链接"""
    out = []
    try:
        d = json.loads(http_get("https://remoteok.com/api", timeout=40,
                                headers={"Accept": "application/json"}))
        for p in d:
            if not isinstance(p, dict) or not p.get("slug"):
                continue
            pub = datetime.fromtimestamp(p.get("epoch") or 0, timezone.utc)
            sal = ""
            if p.get("salary_min") and p.get("salary_max"):
                sal = "%s %s - %s" % (p.get("currency") or "$",
                                      p.get("salary_min"), p.get("salary_max"))
            desc = (p.get("description") or "")[:2000]
            j = make_job("%s — %s" % (p.get("position"), p.get("company")),
                         desc, "remoteok", "RemoteOK · " + str(p.get("company") or ""),
                         pub, p.get("url") or "", jobish=False, remote_hint=True,
                         salary_hint=sal)
            if j:
                out.append(j)
    except Exception as e:
        print("[remoteok] 失败: %s" % str(e)[:80], file=sys.stderr)
    return out


def fetch_remotive():
    """remotive.com 公开接口：远程岗位带薪资"""
    out = []
    try:
        d = json.loads(http_get("https://remotive.com/api/remote-jobs?limit=150", timeout=40))
        for p in d.get("jobs", []):
            try:
                pub = datetime.fromisoformat((p.get("publication_date") or "").replace("Z", "+00:00"))
            except Exception:
                continue
            j = make_job(p.get("title") or "",
                         (p.get("description") or "")[:2000],
                         "remotive", "Remotive · " + str(p.get("company_name") or ""),
                         pub, p.get("url") or "", jobish=False, remote_hint=True,
                         salary_hint=str(p.get("salary") or "")[:40])
            if j:
                out.append(j)
    except Exception as e:
        print("[remotive] 失败: %s" % str(e)[:80], file=sys.stderr)
    return out


def fetch_jobicy():
    """jobicy.com 公开接口"""
    out = []
    try:
        d = json.loads(http_get("https://jobicy.com/api/v2/remote-jobs?count=100", timeout=40))
        for p in d.get("jobs", []):
            try:
                pub = datetime.fromisoformat((p.get("pubDate") or "").replace("Z", "+00:00"))
            except Exception:
                continue
            j = make_job(p.get("jobTitle") or p.get("title") or "",
                         (p.get("jobDescription") or "")[:2000],
                         "jobicy", "Jobicy · " + str(p.get("companyName") or ""),
                         pub, p.get("url") or "", jobish=False, remote_hint=True)
            if j:
                out.append(j)
    except Exception as e:
        print("[jobicy] 失败: %s" % str(e)[:80], file=sys.stderr)
    return out


def fetch_arbeitnow():
    """arbeitnow.com 公开接口：欧洲远程岗"""
    out = []
    try:
        d = json.loads(http_get("https://www.arbeitnow.com/api/job-board-api", timeout=40))
        for p in d.get("data", []):
            if not p.get("remote"):
                continue          # 只收远程岗，德语本地岗对站内受众没意义
            ca = p.get("created_at")
            try:
                if isinstance(ca, (int, float)):
                    pub = datetime.fromtimestamp(ca, timezone.utc)
                else:
                    pub = datetime.fromisoformat(str(ca or "").replace("Z", "+00:00"))
            except Exception:
                continue
            j = make_job("%s — %s" % (p.get("title"), p.get("company_name")),
                         (p.get("description") or "")[:2000],
                         "arbeitnow", "Arbeitnow · " + str(p.get("company_name") or ""),
                         pub, p.get("url") or "", jobish=False,
                         remote_hint=bool(p.get("remote")))
            if j:
                out.append(j)
    except Exception as e:
        print("[arbeitnow] 失败: %s" % str(e)[:80], file=sys.stderr)
    return out


WWR_FEEDS = ["remote-customer-support-jobs", "remote-programming-jobs", "remote-design-jobs",
             "remote-marketing-jobs", "remote-sales-jobs", "remote-devops-sysadmin-jobs"]


def fetch_wwr():
    """weworkremotely.com 的 RSS：老牌远程岗位板"""
    import xml.etree.ElementTree as ET
    out = []
    for feed in WWR_FEEDS:
        try:
            txt = http_get("https://weworkremotely.com/categories/%s.rss" % feed, timeout=30)
            root = ET.fromstring(txt.encode("utf-8", errors="replace"))
            for it in root.iter("item"):
                title = (it.findtext("title") or "").strip()
                # WWR 标题带公司前缀：『Company: Job Title』
                link = (it.findtext("link") or "").strip()
                pub_s = (it.findtext("pubDate") or "").strip()
                try:
                    pub = datetime.strptime(pub_s, "%a, %d %b %Y %H:%M:%S %z")
                except Exception:
                    continue
                desc = clean_text(it.findtext("description") or "", 800)
                title = re.sub(r"^\s*<[^>]+>\s*", "", title)
                j = make_job(title, desc, "rss", "WeWorkRemotely", pub, link,
                             jobish=False, remote_hint=True)
                if j:
                    out.append(j)
        except Exception as e:
            print("[wwr:%s] 失败: %s" % (feed, str(e)[:80]), file=sys.stderr)
        time.sleep(1.0)
    return out


def fetch_hn():
    """Hacker News 每月『Who is hiring』帖：一条评论 = 一个岗位，几百条量级"""
    out = []
    try:
        # 注意必须用 search_by_date：普通 search 会翻出 2020 年的老帖
        d = json.loads(http_get(
            "https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring&hitsPerPage=1",
            timeout=30))
        hits = d.get("hits", [])
        if not hits:
            return out
        story = hits[0]
        sid = story["objectID"]
        cutoff = time.time() - MAX_AGE_DAYS * 86400
        page = 0
        while True:
            c = json.loads(http_get(
                "https://hn.algolia.com/api/v1/search?tags=comment,story_%s&hitsPerPage=1000&page=%d"
                % (sid, page), timeout=40))
            chits = c.get("hits", [])
            if not chits:
                break
            for h in chits:
                if (h.get("created_at_i") or 0) < cutoff:
                    continue
                text = clean_text(h.get("story_text") or h.get("comment_text") or h.get("text") or "", 1200)
                if len(text) < 25:
                    continue
                first = text.split("\n", 1)[0][:140]
                rest = text.split("\n", 1)[1] if "\n" in text else ""
                try:
                    pub = datetime.fromtimestamp(h.get("created_at_i") or 0, timezone.utc)
                except Exception:
                    continue
                j = make_job(first, rest, "hn", "Hacker News · whoishiring", pub,
                             "https://news.ycombinator.com/item?id=" + str(h.get("objectID") or ""),
                             jobish=False, remote_hint=True)
                if j:
                    out.append(j)
            page += 1
            if page >= c.get("nbPages", 1) or page > 3:
                break
    except Exception as e:
        print("[hn] 失败: %s" % str(e)[:80], file=sys.stderr)
    return out


def fetch_v2ex():
    """V2EX 酷工作板块：中文远程/线上岗位"""
    out = []
    try:
        d = json.loads(http_get("https://www.v2ex.com/api/topics/show.json?node_name=jobs", timeout=30))
        for t in d or []:
            try:
                pub = datetime.fromtimestamp(t.get("created") or 0, timezone.utc)
            except Exception:
                continue
            j = make_job((t.get("title") or "")[:140],
                         (t.get("content") or "")[:1200],
                         "v2ex", "V2EX · 酷工作", pub, t.get("url") or "",
                         remote_hint=bool(RE_REMOTE.search((t.get("title") or "") + (t.get("content") or ""))))
            if j:
                out.append(j)
    except Exception as e:
        print("[v2ex] 失败: %s" % str(e)[:80], file=sys.stderr)
    return out


RE_TG_TIME = re.compile(r'datetime="([\d\-T:+]+)"')
RE_TG_TEXT = re.compile(r'class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', re.S)


def fetch_telegram():
    out = []
    for ch in TG_CHANNELS:
        try:
            h = http_get("https://t.me/s/" + ch, timeout=25)
            blocks = re.split(r'class="tgme_widget_message_wrap', h)[1:]
            times = RE_TG_TIME.findall(h)
            for i, b in enumerate(blocks):
                m = RE_TG_TEXT.search(b)
                if not m:
                    continue
                raw = m.group(1)
                txt = clean_text(raw, 800)
                if len(txt) < 30:
                    continue
                lines = txt.split("\n", 1)
                title = lines[0][:140]
                desc = lines[1] if len(lines) > 1 else ""
                t = times[i] if i < len(times) else ""
                try:
                    pub = datetime.fromisoformat(t)
                except Exception:
                    continue
                j = make_job(title, desc, "telegram", "Telegram · @" + ch, pub, "")
                if j:
                    out.append(j)
        except Exception as e:
            print("[tg:%s] 失败: %s" % (ch, str(e)[:80]), file=sys.stderr)
        time.sleep(1.5)
    return out


def fetch_freelancer():
    out = []
    for q in FL_QUERIES:
        try:
            url = ("https://www.freelancer.com/api/projects/0.1/projects/active/"
                   "?query=%s&limit=50&compact=true&job_details=true&sort=time_updated"
                   % urllib.parse.quote(q))
            d = json.loads(http_get(url, timeout=40))
            for p in d.get("result", {}).get("projects", []):
                title = (p.get("title") or "").strip()
                desc = clean_text(p.get("preview_description") or "", 500)
                if q.lower() not in (title + " " + desc).lower():
                    continue
                pub = datetime.fromtimestamp(p.get("time_submitted") or 0, timezone.utc)
                b = p.get("budget") or {}
                money = ""
                if b and b.get("minimum") is not None:
                    money = "%s %s - %s" % (b.get("currency") or "USD",
                                            b.get("minimum"), b.get("maximum") or b.get("minimum"))
                link = "https://www.freelancer.com/projects/%s" % (p.get("seo_url") or p.get("id"))
                j, pv = make_job(title, desc, "freelancer", "Freelancer.com", pub, link) or (None, None)
                if j:
                    j["salary"] = j["salary"] or discount_salary(money)
                    pv["salary"] = pv["salary"] or money
                    pv["quote"] = discount_salary(pv["salary"])
                    pv["contact"] = "Freelancer 平台投标（登录后 bid）"
                    out.append((j, pv))
        except Exception as e:
            print("[freelancer:%s] 失败: %s" % (q, str(e)[:80]), file=sys.stderr)
        time.sleep(1.2)
    return out


def main():
    print("开始抓取 …")
    pairs = []
    pairs += fetch_arctic()
    print("Reddit 版块：%d 条" % len(pairs))
    for fn, name in [(fetch_remoteok, "RemoteOK"), (fetch_remotive, "Remotive"),
                     (fetch_jobicy, "Jobicy"), (fetch_arbeitnow, "Arbeitnow"),
                     (fetch_wwr, "WeWorkRemotely"), (fetch_hn, "HackerNews"),
                     (fetch_v2ex, "V2EX")]:
        n0 = len(pairs)
        try:
            pairs += fn()
        except Exception as e:
            print("[%s] 失败: %s" % (name, str(e)[:80]), file=sys.stderr)
        print("%s：%d 条" % (name, len(pairs) - n0))
    n = len(pairs)
    pairs += fetch_telegram()
    print("Telegram：%d 条" % (len(pairs) - n))
    n = len(pairs)
    pairs += fetch_freelancer()
    print("Freelancer：%d 条" % (len(pairs) - n))

    # 去重（同 id 保留最新）
    best = {}
    for pub, pv in pairs:
        old = best.get(pub["id"])
        if not old or pub["published"] > old[0]["published"]:
            best[pub["id"]] = (pub, pv)
    pairs = sorted(best.values(), key=lambda x: x[0]["published"], reverse=True)

    cutoff = (datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)).isoformat()
    pairs = [(p, v) for p, v in pairs if p["published"] >= cutoff][:MAX_ITEMS]

    public = [p for p, _ in pairs]
    private = [v for _, v in pairs]

    # 全站中文化：标题 + 描述翻译成中文（已是中文的自动跳过，翻译结果按哈希缓存）
    titles = translate_texts([p["title"] for p in public], "（标题）")
    descs = translate_texts([p["desc"] for p in public], "（描述）")
    for p, t, d in zip(public, titles, descs):
        p["title"] = t
        p["desc"] = d
    # 私人版附中文标题（原帖原文保留，方便对照）
    for v, t in zip(private, titles):
        v["title_zh"] = t

    data = {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "count": len(public), "jobs": public}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print("完成：%d 条岗位 → %s" % (len(public), OUT))

    # 私人版：含联系方式+原帖链接+真实价+建议报价。
    # 在 GitHub Actions 里跑时也会生成（但 .gitignore 排除了它，
    # 公共仓库的提交步骤只 add jobs.json，所以绝不会传到公共仓库；
    # 它会由工作流里的"同步私人数据"步骤推到站主的私有仓库）。
    pv_path = os.path.join(os.path.dirname(OUT), "jobs-private.json")
    with open(pv_path, "w", encoding="utf-8") as f:
        json.dump({"updated": data["updated"], "count": len(private), "jobs": private},
                  f, ensure_ascii=False, indent=1)
    if os.environ.get("GITHUB_ACTIONS") == "true":
        print("私人版已生成（CI）：待工作流同步到私有仓库，不会进公共仓库）")
    else:
        print("私人版（含联系方式+真实价+建议报价）：%d 条 → %s（仅本地）" % (len(private), pv_path))

    from collections import Counter
    print("分类分布:", dict(Counter(p["cat"] for p in public)))


if __name__ == "__main__":
    main()
