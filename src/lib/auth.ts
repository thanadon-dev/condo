import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { one, run } from "./db";
import { COOKIE, SESSION_DAYS } from "./auth-const";

export { COOKIE };

const CONFIG_PATH =
  process.env.CONDO_AUTH_CONFIG ||
  path.join(process.env.HOME || "/home/mark", ".config/condo/auth.json");

function configuredPin(): string {
  try {
    const c = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as { pin?: string };
    return String(c.pin ?? "").trim();
  } catch {
    return "";
  }
}

const hash = (s: string) => createHash("sha256").update(s).digest("hex");

function sameSecret(a: string, b: string): boolean {
  const ba = Buffer.from(hash(a));
  const bb = Buffer.from(hash(b));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

const WINDOW_MINUTES = 15;
const MAX_FAILS = 8;

export function failCount(): number {
  return (
    one<{ c: number }>(
      `SELECT COUNT(*) AS c FROM login_fails
       WHERE created_at > datetime('now', ?)`,
      `-${WINDOW_MINUTES} minutes`,
    )?.c ?? 0
  );
}

export function isLocked(): boolean {
  return failCount() >= MAX_FAILS;
}

function recordFail(): void {
  run("INSERT INTO login_fails DEFAULT VALUES");
  run(
    "DELETE FROM login_fails WHERE created_at < datetime('now','-1 day')",
  );
}

function clearFails(): void {
  run("DELETE FROM login_fails");
}

export type LoginResult =
  | { ok: true; token: string }
  | { ok: false; reason: "locked" | "wrong" | "unconfigured" };

export function login(pin: string): LoginResult {
  const expected = configuredPin();
  if (!expected) return { ok: false, reason: "unconfigured" };
  if (isLocked()) return { ok: false, reason: "locked" };

  const given = String(pin ?? "").trim().slice(0, 64);
  if (!given || !sameSecret(given, expected)) {
    recordFail();
    return { ok: false, reason: "wrong" };
  }

  clearFails();
  const token = randomBytes(32).toString("hex");
  run(
    "INSERT INTO admin_sessions (token,expires_at) VALUES (?,datetime('now',?))",
    hash(token),
    `+${SESSION_DAYS} days`,
  );
  run("DELETE FROM admin_sessions WHERE expires_at < datetime('now')");
  return { ok: true, token };
}

export function validToken(token: string): boolean {
  if (!token) return false;
  return Boolean(
    one<{ token: string }>(
      "SELECT token FROM admin_sessions WHERE token = ? AND expires_at > datetime('now')",
      hash(token),
    ),
  );
}

export function destroySession(token: string): void {
  if (token) run("DELETE FROM admin_sessions WHERE token = ?", hash(token));
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return validToken(jar.get(COOKIE)?.value ?? "");
}

export async function requireAdmin(): Promise<boolean> {
  return isAdmin();
}

export function sessionCount(): number {
  return (
    one<{ c: number }>(
      "SELECT COUNT(*) AS c FROM admin_sessions WHERE expires_at > datetime('now')",
    )?.c ?? 0
  );
}

export function destroyAllSessions(): void {
  run("DELETE FROM admin_sessions");
}
