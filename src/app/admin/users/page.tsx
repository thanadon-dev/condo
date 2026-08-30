import { listUsers, currentUser } from "@/lib/auth";
import AdminToggle from "@/components/admin/AdminToggle";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const me = await currentUser();
  const users = listUsers();

  return (
    <>
      <div className="mb-8">
        <h2 className="display text-[26px] th">ผู้ดูแลระบบ</h2>
        <p className="th mt-1 text-[13px] text-muted">
          คนแรกที่ล็อกอินได้สิทธิ์ผู้ดูแลอัตโนมัติ · หลังจากนั้นต้องให้สิทธิ์ที่นี่
        </p>
      </div>

      <div className="border border-line-2 overflow-x-auto">
        <table className="w-full th text-[13px]">
          <thead className="bg-sand/60">
            <tr>
              {["อีเมล", "ชื่อ", "สิทธิ์", "เข้าล่าสุด", "จัดการ"].map((h) => (
                <th
                  key={h}
                  className="text-left kicker px-4 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-line-2">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={u.is_admin ? "" : "text-muted"}>
                    {u.is_admin ? "ผู้ดูแล" : "ทั่วไป"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {u.last_login?.slice(0, 16) ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <AdminToggle
                    id={u.id}
                    isAdmin={u.is_admin === 1}
                    self={me?.id === u.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="th mt-4 text-[12px] text-muted">
        ถอนสิทธิ์แล้วเซสชันของคนนั้นถูกลบทันที · ต้องเหลือผู้ดูแลอย่างน้อย 1 คน
      </p>
    </>
  );
}
