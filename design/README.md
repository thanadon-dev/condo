# design/ — ต้นฉบับดีไซน์

## themes-src/
HTML ต้นฉบับของธีมทั้ง 10 สไตล์ (1a–10a) แกะมาจาก
`UI mockups for property homepage.zip` ที่ได้จาก Claude Design

- ไฟล์ zip เดิมเป็น bundle 2 ไฟล์ (manifest base64 + gzip) เปิดอ่านตรง ๆ ไม่ได้
- สคริปต์แกะ: อ่าน `<script type="__bundler/manifest">` + `__bundler/template`
  แล้วตัดตาม `<section>` ระดับบนสุด (1 section = 1 ธีม)
- `fonts/` (woff2 ที่ฝังมาใน bundle) ถูก gitignore ไว้ — ไม่ได้ใช้จริง
  เว็บโหลดฟอนต์ผ่าน `next/font/google` ใน `src/lib/fonts.ts` แทน
  ถ้าต้องการเปิดไฟล์ HTML ในโฟลเดอร์นี้ให้เห็นฟอนต์ถูกต้อง ต้องแกะ zip ใหม่

## ใช้ทำอะไร
เป็น **แหล่งอ้างอิงค่าจริง** ของ design token ทุกตัวใน `src/lib/themes.ts`
(สี ฟอนต์ ขนาดหัวเรื่อง มุมโค้ง เงา)

**ห้ามแก้ค่าสี/ฟอนต์ใน themes.ts ด้วยการเดา** — ถ้าต้องปรับ ให้เปิดไฟล์ธีมนั้น
แล้วอ่านค่าจาก inline style จริง หรือรัน headless browser อ่าน computed style
