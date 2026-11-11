"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { WECHAT_ID } from "@/lib/jobs";

/** 全站唯一的申请出口：复制站主微信号 */
export default function WeChatCTA() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = WECHAT_ID;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return (
    <button onClick={copy} className="btn-gold shrink-0 px-6 py-3 text-sm">
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "微信号已复制，去微信添加" : "提交岗位申请"}
    </button>
  );
}
