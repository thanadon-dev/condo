CREATE TABLE IF NOT EXISTS slug_aliases (
  kind TEXT NOT NULL,
  old_slug TEXT NOT NULL,
  new_slug TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (kind, old_slug)
);
