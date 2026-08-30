import { readFileSync } from "node:fs";
import path from "node:path";

type TgConfig = { enabled?: boolean; bot_token?: string; chat_id?: string };

let cached: TgConfig | null | undefined;

function config(): TgConfig | null {
  if (cached !== undefined) return cached;
  const p =
    process.env.CONDO_TG_CONFIG ||
    path.join(
      process.env.HOME || "/home/mark",
      ".claude/skills/telegram-webhook/config.json",
    );
  try {
    const c = JSON.parse(readFileSync(p, "utf8")) as TgConfig;
    cached = c.enabled && c.bot_token && c.chat_id ? c : null;
  } catch {
    cached = null;
  }
  return cached;
}

export async function notify(text: string): Promise<boolean> {
  const c = config();
  if (!c) return false;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${c.bot_token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: c.chat_id,
          text: text.slice(0, 3900),
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
