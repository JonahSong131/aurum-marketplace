// ============================================================
// 联系方式统一出口 —— 全站所有「购买 / 预约 / 咨询」都走这里
// 改号码只改这一处。
// ============================================================

export const WHATSAPP_NUMBER = "8617360036682"; // 纯数字，wa.me 用（主号）
export const WHATSAPP_DISPLAY = "+86 173 6003 6682";
export const WHATSAPP_NUMBER_2 = "8617612845394"; // 第二号
export const WHATSAPP_DISPLAY_2 = "+86 176 1284 5394";
export const EMAIL = "songxiwen69@gmail.com";

/** 生成带预填文案的 WhatsApp 链接（默认主号） */
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** 第二号 WhatsApp 链接 */
export function waLink2(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER_2}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** 咨询某份旅行指南 */
export function waGuideMessage(title: string): string {
  return `Hi! I'm interested in the "${title}" travel guide from Ximi. Could you tell me more?`;
}

/** 咨询某位地陪 */
export function waCompanionMessage(name: string, city: string): string {
  return `Hi! I'd like to book ${name} as my local companion in ${city}. Are they available?`;
}

/** 咨询包车 */
export function waCharterMessage(car: string, city: string): string {
  return `Hi! I'd like a private car (${car}) with driver in ${city}. Could you send me the details?`;
}

/** 通用咨询 */
export function waGeneralMessage(): string {
  return "Hi! I'm planning a trip to China and would like to know more about your local companion service.";
}
