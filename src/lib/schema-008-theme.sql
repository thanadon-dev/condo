-- ธีมที่เลือกใช้ เก็บในตาราง settings เดิม (key='theme')
-- ไม่ต้องสร้างตารางใหม่ — settings เป็น key/value อยู่แล้ว
-- ไฟล์นี้มีไว้เพื่อบันทึกว่า key นี้ถูกเพิ่มในเวอร์ชันไหน และตั้งค่าเริ่มต้น
INSERT INTO settings (key, value, updated_at)
SELECT 'theme', 'editorial', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'theme');
