import Link from "next/link";
import { adminArticles } from "@/lib/admin";
import { thaiDate } from "@/lib/site";
import CreatePanel from "@/components/admin/CreatePanel";
import DeleteButton from "@/components/admin/DeleteButton";
import { saveArticle, deleteArticle } from "@/app/actions/admin";
import { ARTICLE_FIELDS } from "../fields";

export const dynamic = "force-dynamic";

export default function AdminArticles() {
  const items = adminArticles();

  const actionBtn =
    "th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="display text-[26px] th">บทความ</h2>
          <p className="th mt-1 text-[13px] text-muted">
            ทั้งหมด {items.length} รายการ · บทความที่เผยแพร่จะขึ้นบนสุดของหน้าบทความ
          </p>
        </div>
        <CreatePanel
          action={saveArticle}
          fields={ARTICLE_FIELDS}
          title="ลงบทความใหม่"
          buttonLabel="+ ลงบทความ"
        />
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((a) => (
          <div key={a.id} className="border border-line-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="th text-[14.5px] font-medium leading-snug min-w-0">
                {a.title}
              </div>
              <span className="th text-[11px] px-2 py-1 border border-line-2 shrink-0 text-muted">
                {a.published ? "เผยแพร่" : "ซ่อน"}
              </span>
            </div>
            <div className="th text-[12px] text-muted mt-2">
              {a.tag} · {thaiDate(a.published_on)} · อ่าน {a.read_time}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-line-2">
              <Link href={`/journal/${a.slug}`} className={actionBtn}>
                ดู
              </Link>
              <Link href={`/admin/articles/${a.id}`} className={actionBtn}>
                แก้ไข
              </Link>
              <DeleteButton action={deleteArticle} id={a.id} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block border border-line-2 overflow-x-auto">
        <table className="w-full th text-[13px]">
          <thead className="bg-sand/60">
            <tr>
              {["บทความ", "หมวด", "วันที่", "เวลาอ่าน", "สถานะ", "จัดการ"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left kicker px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t border-line-2">
                <td className="px-4 py-3 max-w-[340px]">
                  <div className="font-medium truncate">{a.title}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{a.tag}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {thaiDate(a.published_on)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{a.read_time}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={a.published ? "" : "text-muted"}>
                    {a.published ? "เผยแพร่" : "ซ่อน"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link href={`/journal/${a.slug}`} className={actionBtn}>
                      ดู
                    </Link>
                    <Link href={`/admin/articles/${a.id}`} className={actionBtn}>
                      แก้ไข
                    </Link>
                    <DeleteButton action={deleteArticle} id={a.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
