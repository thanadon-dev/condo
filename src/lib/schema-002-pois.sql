CREATE TABLE IF NOT EXISTS property_pois (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  distance_m INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_poi_prop ON property_pois(property_id, distance_m);
