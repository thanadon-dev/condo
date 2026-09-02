import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

let handle: DatabaseSync | null = null;

/**
 * CONDO_READONLY=1 -> เปิด DB แบบอ่านอย่างเดียว ไม่รัน migration/schema เขียน
 * ใช้กับ instance ทดลองธีม (condo2, condo3) ที่ชี้ไปไฟล์ DB เดียวกับตัวจริง
 * กันพลาดเขียนทับข้อมูลจริงจากธีมที่ยังทดสอบอยู่
 */
const READONLY = process.env.CONDO_READONLY === "1";

export function db(): DatabaseSync {
  if (handle) return handle;
  mkdirSync(DATA_DIR, { recursive: true });
  const dbPath = path.join(DATA_DIR, "condo.db");
  const conn = READONLY
    ? new DatabaseSync(dbPath, { readOnly: true })
    : new DatabaseSync(dbPath);
  if (!READONLY) {
    conn.exec("PRAGMA journal_mode = WAL");
    conn.exec("PRAGMA foreign_keys = ON");
    for (const f of [
      "schema.sql",
      "schema-002-pois.sql",
      "schema-003-leads.sql",
      "schema-005-pin.sql",
      "schema-006-settings.sql",
      "schema-007-slug-aliases.sql",
    ]) {
      conn.exec(readFileSync(path.join(process.cwd(), "src/lib", f), "utf8"));
    }
  }
  handle = conn;
  return conn;
}

function plain<T>(row: unknown): T {
  return Object.assign({}, row) as T;
}

export function all<T = Record<string, unknown>>(
  sql: string,
  ...params: (string | number | null)[]
): T[] {
  return (db().prepare(sql).all(...params) as unknown[]).map((r) => plain<T>(r));
}

export function one<T = Record<string, unknown>>(
  sql: string,
  ...params: (string | number | null)[]
): T | null {
  const row = db().prepare(sql).get(...params);
  return row == null ? null : plain<T>(row);
}

export function run(
  sql: string,
  ...params: (string | number | null)[]
): { changes: number | bigint; lastInsertRowid: number | bigint } {
  return db().prepare(sql).run(...params);
}
