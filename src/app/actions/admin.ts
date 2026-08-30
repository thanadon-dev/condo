"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, setAdmin } from "@/lib/auth";
import { run, one } from "@/lib/db";
import { slugify, uniqueSlug } from "@/lib/slug";
import { all } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/lead-status";

export type ActionState = { ok: boolean; message: string };

const s = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim()
    .slice(0, max);

const num = (v: FormDataEntryValue | null, def = 0) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) && n >= 0 && n <= 1_000_000_000 ? Math.floor(n) : def;
};

async function guard(): Promise<boolean> {
  return Boolean(await requireAdmin());
}

function takenSlugs(table: string, exceptId: number | null): Set<string> {
  const rows = all<{ slug: string; id: number }>(
    `SELECT slug, id FROM ${table}`,
  );
  return new Set(
    rows.filter((r) => r.id !== exceptId).map((r) => r.slug),
  );
}

function refreshPublic(paths: string[]) {
  for (const p of ["/", "/sitemap.xml", ...paths]) {
    try {
      revalidatePath(p);
    } catch {
      /* ignore */
    }
  }
}

export async function saveProperty(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!(await guard())) return { ok: false, message: "ไม่มีสิทธิ์" };

  const id = num(form.get("id"), 0) || null;
  const title = s(form.get("title"), 160);
  if (title.length < 2) return { ok: false, message: "กรุณากรอกชื่อทรัพย์" };

  const fields = {
    title,
    cat: s(form.get("cat"), 40) || "คอนโด",
    type: s(form.get("type"), 40) || "คอนโดมิเนียม",
    district: s(form.get("district"), 80),
    location: s(form.get("location"), 200),
    price: num(form.get("price")),
    beds: num(form.get("beds")),
    baths: num(form.get("baths")),
    area: num(form.get("area")),
    floor: s(form.get("floor"), 40),
    year: s(form.get("year"), 20),
    park: s(form.get("park"), 40),
    descr: s(form.get("descr"), 2000),
    descr2: s(form.get("descr2"), 2000),
    published: form.get("published") ? 1 : 0,
  };

  try {
    if (id) {
      const prev = one<{ slug: string }>(
        "SELECT slug FROM properties WHERE id = ?",
        id,
      );
      if (!prev) return { ok: false, message: "ไม่พบทรัพย์นี้" };

      run(
        `UPDATE properties SET title=?,cat=?,type=?,district=?,location=?,price=?,
         beds=?,baths=?,area=?,floor=?,year=?,park=?,descr=?,descr2=?,published=?,
         updated_at=datetime('now') WHERE id=?`,
        fields.title,
        fields.cat,
        fields.type,
        fields.district,
        fields.location,
        fields.price,
        fields.beds,
        fields.baths,
        fields.area,
        fields.floor,
        fields.year,
        fields.park,
        fields.descr,
        fields.descr2,
        fields.published,
        id,
      );
      refreshPublic([`/property/${prev.slug}`, "/properties"]);
      return { ok: true, message: "บันทึกแล้ว" };
    }

    const slug = uniqueSlug(title, takenSlugs("properties", null));
    const maxCode =
      one<{ n: number }>(
        "SELECT COALESCE(MAX(CAST(SUBSTR(code,4) AS INTEGER)),1000) AS n FROM properties",
      )?.n ?? 1000;

    run(
      `INSERT INTO properties (slug,code,title,cat,type,district,location,price,
       beds,baths,area,floor,year,park,descr,descr2,amenities,published)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'[]',?)`,
      slug,
      `CD-${maxCode + 1}`,
      fields.title,
      fields.cat,
      fields.type,
      fields.district,
      fields.location,
      fields.price,
      fields.beds,
      fields.baths,
      fields.area,
      fields.floor,
      fields.year,
      fields.park,
      fields.descr,
      fields.descr2,
      fields.published,
    );
    refreshPublic(["/properties"]);
    return { ok: true, message: "เพิ่มทรัพย์ใหม่แล้ว" };
  } catch {
    return { ok: false, message: "บันทึกไม่สำเร็จ" };
  }
}

export async function deleteProperty(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!(await guard())) return { ok: false, message: "ไม่มีสิทธิ์" };
  const id = num(form.get("id"), 0);
  if (!id) return { ok: false, message: "ไม่พบรายการ" };
  try {
    run("DELETE FROM properties WHERE id = ?", id);
    refreshPublic(["/properties"]);
    return { ok: true, message: "ลบแล้ว" };
  } catch {
    return { ok: false, message: "ลบไม่สำเร็จ" };
  }
}

export async function saveDeal(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!(await guard())) return { ok: false, message: "ไม่มีสิทธิ์" };

  const id = num(form.get("id"), 0) || null;
  const title = s(form.get("title"), 200);
  if (title.length < 2) return { ok: false, message: "กรุณากรอกหัวข้อผลงาน" };

  const closed = s(form.get("closed_on"), 10) || "2026-01-01";
  const cat = s(form.get("cat"), 40) || "บ้านเช่า";
  const location = s(form.get("location"), 160);
  const value = s(form.get("value"), 80);
  const body = s(form.get("body"), 6000);
  const published = form.get("published") ? 1 : 0;

  try {
    if (id) {
      const prev = one<{ slug: string }>(
        "SELECT slug FROM deals WHERE id = ?",
        id,
      );
      if (!prev) return { ok: false, message: "ไม่พบผลงานนี้" };
      run(
        `UPDATE deals SET closed_on=?,title=?,cat=?,location=?,value=?,body=?,published=?
         WHERE id=?`,
        closed,
        title,
        cat,
        location,
        value,
        body,
        published,
        id,
      );
      refreshPublic([`/deal/${prev.slug}`, "/about"]);
      return { ok: true, message: "บันทึกแล้ว" };
    }

    const slug = uniqueSlug(title, takenSlugs("deals", null));
    run(
      `INSERT INTO deals (slug,closed_on,title,cat,location,value,imgs,body,published)
       VALUES (?,?,?,?,?,?,0,?,?)`,
      slug,
      closed,
      title,
      cat,
      location,
      value,
      body,
      published,
    );
    refreshPublic(["/about"]);
    return { ok: true, message: "เพิ่มผลงานใหม่แล้ว" };
  } catch {
    return { ok: false, message: "บันทึกไม่สำเร็จ" };
  }
}

export async function deleteDeal(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!(await guard())) return { ok: false, message: "ไม่มีสิทธิ์" };
  const id = num(form.get("id"), 0);
  if (!id) return { ok: false, message: "ไม่พบรายการ" };
  try {
    run("DELETE FROM deals WHERE id = ?", id);
    refreshPublic(["/about"]);
    return { ok: true, message: "ลบแล้ว" };
  } catch {
    return { ok: false, message: "ลบไม่สำเร็จ" };
  }
}

export async function saveArticle(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!(await guard())) return { ok: false, message: "ไม่มีสิทธิ์" };

  const id = num(form.get("id"), 0) || null;
  const title = s(form.get("title"), 200);
  if (title.length < 2) return { ok: false, message: "กรุณากรอกหัวข้อบทความ" };

  const tag = s(form.get("tag"), 60);
  const published_on = s(form.get("published_on"), 10) || "2026-01-01";
  const read_time = s(form.get("read_time"), 30);
  const lead = s(form.get("lead"), 600);
  const body = s(form.get("body"), 20000);
  const published = form.get("published") ? 1 : 0;

  try {
    if (id) {
      const prev = one<{ slug: string }>(
        "SELECT slug FROM articles WHERE id = ?",
        id,
      );
      if (!prev) return { ok: false, message: "ไม่พบบทความนี้" };
      run(
        `UPDATE articles SET title=?,tag=?,published_on=?,read_time=?,lead=?,body=?,published=?
         WHERE id=?`,
        title,
        tag,
        published_on,
        read_time,
        lead,
        body,
        published,
        id,
      );
      refreshPublic([`/journal/${prev.slug}`, "/journal"]);
      return { ok: true, message: "บันทึกแล้ว" };
    }

    const slug = uniqueSlug(title, takenSlugs("articles", null));
    run(
      `INSERT INTO articles (slug,title,tag,published_on,read_time,lead,body,published)
       VALUES (?,?,?,?,?,?,?,?)`,
      slug,
      title,
      tag,
      published_on,
      read_time,
      lead,
      body,
      published,
    );
    refreshPublic(["/journal"]);
    return { ok: true, message: "เผยแพร่บทความแล้ว" };
  } catch {
    return { ok: false, message: "บันทึกไม่สำเร็จ" };
  }
}

export async function deleteArticle(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!(await guard())) return { ok: false, message: "ไม่มีสิทธิ์" };
  const id = num(form.get("id"), 0);
  if (!id) return { ok: false, message: "ไม่พบรายการ" };
  try {
    run("DELETE FROM articles WHERE id = ?", id);
    refreshPublic(["/journal"]);
    return { ok: true, message: "ลบแล้ว" };
  } catch {
    return { ok: false, message: "ลบไม่สำเร็จ" };
  }
}

export async function setLeadStatus(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!(await guard())) return { ok: false, message: "ไม่มีสิทธิ์" };
  const id = num(form.get("id"), 0);
  const status = s(form.get("status"), 20);
  if (!id || !LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number]))
    return { ok: false, message: "ข้อมูลไม่ถูกต้อง" };
  try {
    run("UPDATE leads SET status = ? WHERE id = ?", status, id);
    revalidatePath("/admin/leads");
    return { ok: true, message: "อัปเดตแล้ว" };
  } catch {
    return { ok: false, message: "อัปเดตไม่สำเร็จ" };
  }
}

export async function toggleAdmin(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const me = await requireAdmin();
  if (!me) return { ok: false, message: "ไม่มีสิทธิ์" };

  const id = num(form.get("id"), 0);
  const on = form.get("on") === "1";
  if (!id) return { ok: false, message: "ไม่พบผู้ใช้" };
  if (id === me.id && !on)
    return { ok: false, message: "ถอนสิทธิ์ตัวเองไม่ได้" };

  if (!setAdmin(id, on))
    return { ok: false, message: "ต้องมีผู้ดูแลอย่างน้อย 1 คน" };

  revalidatePath("/admin/users");
  return { ok: true, message: on ? "ให้สิทธิ์แล้ว" : "ถอนสิทธิ์แล้ว" };
}
