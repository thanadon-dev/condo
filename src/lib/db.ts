import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

let handle: DatabaseSync | null = null;

export function db(): DatabaseSync {
  if (handle) return handle;
  mkdirSync(DATA_DIR, { recursive: true });
  const conn = new DatabaseSync(path.join(DATA_DIR, "condo.db"));
  conn.exec("PRAGMA journal_mode = WAL");
  conn.exec("PRAGMA foreign_keys = ON");
  const schema = readFileSync(
    path.join(process.cwd(), "src/lib/schema.sql"),
    "utf8",
  );
  conn.exec(schema);
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
