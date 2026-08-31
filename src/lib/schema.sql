CREATE TABLE IF NOT EXISTS areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  query TEXT NOT NULL DEFAULT '',
  cover TEXT NOT NULL DEFAULT '',
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  cat TEXT NOT NULL,
  type TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  lat REAL,
  lng REAL,
  price INTEGER NOT NULL DEFAULT 0,
  beds INTEGER NOT NULL DEFAULT 0,
  baths INTEGER NOT NULL DEFAULT 0,
  area REAL NOT NULL DEFAULT 0,
  floor TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  park TEXT NOT NULL DEFAULT '',
  descr TEXT NOT NULL DEFAULT '',
  descr2 TEXT NOT NULL DEFAULT '',
  amenities TEXT NOT NULL DEFAULT '[]',
  views INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_prop_cat ON properties(cat);
CREATE INDEX IF NOT EXISTS idx_prop_district ON properties(district);
CREATE INDEX IF NOT EXISTS idx_prop_price ON properties(price);

CREATE TABLE IF NOT EXISTS property_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_img_prop ON property_images(property_id, sort);

CREATE TABLE IF NOT EXISTS deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  closed_on TEXT NOT NULL,
  title TEXT NOT NULL,
  cat TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  value TEXT NOT NULL DEFAULT '',
  imgs INTEGER NOT NULL DEFAULT 0,
  body TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_deal_date ON deals(closed_on DESC);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT '',
  published_on TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '',
  lead TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_art_date ON articles(published_on DESC);

-- ตาราง settings ย้ายไป schema-006-settings.sql (มี updated_at ด้วย)
-- ห้ามประกาศซ้ำที่นี่: CREATE TABLE IF NOT EXISTS จะข้ามตัวใหม่ทั้งก้อน
