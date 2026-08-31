/**
 * ถอดเสียงไทย -> อักษรละติน (แบบง่าย เน้นได้ ASCII เสมอ)
 * ใช้กับ slug เท่านั้น ไม่ใช่งานแปลภาษา — ขอแค่ URL ก็อปแล้วอ่านออก
 */

/**
 * ชื่อเฉพาะที่มีคำสะกดอังกฤษอย่างเป็นทางการอยู่แล้ว
 * ถอดเสียงอัตโนมัติจะได้ผลแปลก (แอชตัน อโศก -> aeochtan-oosk) จึงต้องทับด้วยของจริง
 * เพิ่มรายการใหม่ได้เรื่อย ๆ เมื่อมีโครงการ/ทำเลใหม่
 */
const PROPER: [RegExp, string][] = [
  // ทำเล / ย่าน
  [/สุขุมวิท/g, "sukhumvit"],
  [/สาทร/g, "sathorn"],
  [/สีลม/g, "silom"],
  [/ทองหล่อ/g, "thonglor"],
  [/เอกมัย/g, "ekkamai"],
  [/อโศก/g, "asoke"],
  [/รามคำแหง/g, "ramkhamhaeng"],
  [/ราชพฤกษ์/g, "ratchaphruek"],
  [/พระราม ?9|พระรามเก้า/g, "rama-9"],
  [/ลาดพร้าว/g, "ladprao"],
  [/อารีย์/g, "ari"],
  [/ริมแม่น้ำ/g, "riverside"],
  [/แม่น้ำ/g, "river"],
  [/วัฒนา/g, "watthana"],
  [/คลองเตย/g, "khlongtoei"],
  [/บางนา/g, "bangna"],
  [/พญาไท/g, "phayathai"],
  [/จตุจักร/g, "chatuchak"],
  [/ห้วยขวาง/g, "huaikhwang"],
  [/ดินแดง/g, "dindaeng"],
  // ชื่อโครงการ
  [/แอชตัน/g, "ashton"],
  [/นิช โมโน|นิชโมโน/g, "niche-mono"],
  [/บ้านกลางเมือง/g, "baan-klang-muang"],
  [/ไอดีโอ/g, "ideo"],
  [/ริทึ่ม|ริธึม/g, "rhythm"],
  [/โนเบิล/g, "noble"],
  [/ไลฟ์/g, "life"],
  [/เดอะ เบส|เดอะเบส/g, "the-base"],
];

// คำทับศัพท์ที่เจอบ่อยในชื่อโครงการ — แปลงก่อนถอดทีละตัวอักษร
const WORDS: [RegExp, string][] = [
  [/คอนโดมิเนียม/g, "condominium"],
  [/คอนโด/g, "condo"],
  [/เพนท์เฮาส์|เพนต์เฮ้าส์/g, "penthouse"],
  [/ทาวน์โฮม/g, "townhome"],
  [/ทาวน์เฮาส์/g, "townhouse"],
  [/บ้านเดี่ยว/g, "single-house"],
  [/บ้านเช่า/g, "house-for-rent"],
  [/วิลล่า|วิลลา/g, "villa"],
  [/เรสซิเดนซ์|เรซิเดนซ์/g, "residence"],
  [/อพาร์ทเมนท์|อพาร์ตเมนต์/g, "apartment"],
  [/เดอะ/g, "the"],
  [/ริเวอร์/g, "river"],
  [/ลอฟท์|ลอฟต์/g, "loft"],
  [/พาร์ค/g, "park"],
  [/ทาวเวอร์/g, "tower"],
  [/เพลส/g, "place"],
  [/สตูดิโอ/g, "studio"],
  [/ชั้น/g, "floor"],
  [/ซอย/g, "soi"],
  [/ถนน/g, "road"],
  [/กรุงเทพฯ|กรุงเทพ/g, "bangkok"],
];

const CONSONANTS: Record<string, string> = {
  ก: "k", ข: "kh", ฃ: "kh", ค: "kh", ฅ: "kh", ฆ: "kh",
  ง: "ng", จ: "ch", ฉ: "ch", ช: "ch", ซ: "s", ฌ: "ch",
  ญ: "y", ฎ: "d", ฏ: "t", ฐ: "th", ฑ: "th", ฒ: "th",
  ณ: "n", ด: "d", ต: "t", ถ: "th", ท: "th", ธ: "th",
  น: "n", บ: "b", ป: "p", ผ: "ph", ฝ: "f", พ: "ph",
  ฟ: "f", ภ: "ph", ม: "m", ย: "y", ร: "r", ล: "l",
  ว: "w", ศ: "s", ษ: "s", ส: "s", ห: "h", ฬ: "l",
  อ: "o", ฮ: "h",
};

const VOWELS: Record<string, string> = {
  ะ: "a", "ั": "a", า: "a", "ำ": "am",
  "ิ": "i", "ี": "i", "ึ": "ue", "ื": "ue",
  "ุ": "u", "ู": "u",
  เ: "e", แ: "ae", โ: "o", ใ: "ai", ไ: "ai",
  "็": "", "์": "", ๆ: "",
  "่": "", "้": "", "๊": "", "๋": "", "ฺ": "",
};

const DIGITS: Record<string, string> = {
  "๐": "0", "๑": "1", "๒": "2", "๓": "3", "๔": "4",
  "๕": "5", "๖": "6", "๗": "7", "๘": "8", "๙": "9",
};

/** true ถ้ามีอักขระไทยอยู่ในสตริง */
export function hasThai(s: string): boolean {
  return /[\u0E00-\u0E7F]/.test(s);
}

export function romanize(input: string): string {
  let s = String(input || "");
  for (const [re, en] of PROPER) s = s.replace(re, ` ${en} `);
  for (const [re, en] of WORDS) s = s.replace(re, ` ${en} `);

  let out = "";
  for (const ch of s) {
    if (DIGITS[ch] !== undefined) out += DIGITS[ch];
    else if (VOWELS[ch] !== undefined) out += VOWELS[ch];
    else if (CONSONANTS[ch] !== undefined) out += CONSONANTS[ch];
    else if (/[\u0E00-\u0E7F]/.test(ch)) out += "";
    else out += ch;
  }

  return out
    .replace(/\s+/g, " ")
    .trim();
}
