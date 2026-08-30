import { randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { all, one, run } from "./db";

import { COOKIE, SESSION_DAYS } from "./auth-const";

export { COOKIE };

export type User = {
  id: number;
  email: string;
  name: string;
  picture: string;
  is_admin: number;
  created_at: string;
  last_login: string | null;
};

type GoogleCfg = { client_id: string; client_secret: string };

let cfgCache: GoogleCfg | null | undefined;

export function googleConfig(): GoogleCfg | null {
  if (cfgCache !== undefined) return cfgCache;
  const p =
    process.env.CONDO_GOOGLE_CONFIG ||
    path.join(process.env.HOME || "/home/mark", ".config/cursors/google.json");
  try {
    const c = JSON.parse(readFileSync(p, "utf8")) as GoogleCfg;
    cfgCache = c.client_id && c.client_secret ? c : null;
  } catch {
    cfgCache = null;
  }
  return cfgCache;
}

const hash = (s: string) => createHash("sha256").update(s).digest("hex");

export function newState(): string {
  const s = randomBytes(24).toString("hex");
  run("DELETE FROM oauth_states WHERE created_at < datetime('now','-15 minutes')");
  run("INSERT INTO oauth_states (state) VALUES (?)", s);
  return s;
}

export function consumeState(s: string): boolean {
  if (!s) return false;
  const row = one<{ state: string }>(
    "SELECT state FROM oauth_states WHERE state = ? AND created_at > datetime('now','-15 minutes')",
    s,
  );
  run("DELETE FROM oauth_states WHERE state = ?", s);
  return Boolean(row);
}

export function upsertUser(profile: {
  email: string;
  name: string;
  picture: string;
}): User | null {
  const email = profile.email.toLowerCase().trim();
  if (!email) return null;

  const existing = one<User>("SELECT * FROM users WHERE email = ?", email);

  if (existing) {
    run(
      "UPDATE users SET name = ?, picture = ?, last_login = datetime('now') WHERE id = ?",
      profile.name,
      profile.picture,
      existing.id,
    );
    return one<User>("SELECT * FROM users WHERE id = ?", existing.id);
  }

  const total = one<{ c: number }>("SELECT COUNT(*) AS c FROM users")?.c ?? 0;
  run(
    "INSERT INTO users (email,name,picture,is_admin,last_login) VALUES (?,?,?,?,datetime('now'))",
    email,
    profile.name,
    profile.picture,
    total === 0 ? 1 : 0,
  );
  return one<User>("SELECT * FROM users WHERE email = ?", email);
}

export function createSession(userId: number): string {
  const token = randomBytes(32).toString("hex");
  run(
    `INSERT INTO sessions (token,user_id,expires_at)
     VALUES (?,?,datetime('now',?))`,
    hash(token),
    userId,
    `+${SESSION_DAYS} days`,
  );
  run("DELETE FROM sessions WHERE expires_at < datetime('now')");
  return token;
}

export function userByToken(token: string): User | null {
  if (!token) return null;
  return one<User>(
    `SELECT u.* FROM users u
     JOIN sessions s ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > datetime('now')`,
    hash(token),
  );
}

export function destroySession(token: string): void {
  if (token) run("DELETE FROM sessions WHERE token = ?", hash(token));
}

export function destroyUserSessions(userId: number): void {
  run("DELETE FROM sessions WHERE user_id = ?", userId);
}

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? "";
  return userByToken(token);
}

export async function requireAdmin(): Promise<User | null> {
  const u = await currentUser();
  return u && u.is_admin === 1 ? u : null;
}

export function listUsers(): User[] {
  return all<User>("SELECT * FROM users ORDER BY id");
}

export function adminCount(): number {
  return one<{ c: number }>("SELECT COUNT(*) AS c FROM users WHERE is_admin = 1")
    ?.c ?? 0;
}

export function setAdmin(userId: number, on: boolean): boolean {
  if (!on && adminCount() <= 1) return false;
  run("UPDATE users SET is_admin = ? WHERE id = ?", on ? 1 : 0, userId);
  if (!on) destroyUserSessions(userId);
  return true;
}
