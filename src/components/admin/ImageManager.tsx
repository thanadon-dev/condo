"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  uploadPropertyImages,
  deletePropertyImage,
  movePropertyImage,
  type UploadState,
} from "@/app/actions/images";
import { prepareImage } from "@/lib/client-image";

const INIT: UploadState = { ok: false, message: "" };

export type ImageRow = {
  id: number;
  url: string;
  thumb_url: string;
  alt: string;
  width: number;
  height: number;
};

const btn =
  "th text-[12px] px-2.5 py-1.5 border border-line-2 hover:border-ink transition-colors disabled:opacity-40";

export default function ImageManager({
  propertyId,
  images,
}: {
  propertyId: number;
  images: ImageRow[];
}) {
  const [state, action, pending] = useActionState(uploadPropertyImages, INIT);
  const [prep, setPrep] = useState("");
  const [busy, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * ย่อรูปในเบราว์เซอร์ก่อน แล้วค่อยยิง action
   * (ทำเองแทน form action ปกติ เพราะต้องสลับไฟล์ใน FormData ก่อนส่ง)
   */
  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPrep(`กำลังย่อรูป 0/${files.length}…`);
    const fd = new FormData();
    fd.set("propertyId", String(propertyId));

    let before = 0;
    let after = 0;
    for (const [i, f] of files.entries()) {
      const r = await prepareImage(f);
      before += r.originalBytes;
      after += r.bytes;
      fd.append("files", r.file);
      setPrep(`กำลังย่อรูป ${i + 1}/${files.length}…`);
    }

    // บอกเซิร์ฟเวอร์ว่าต้นฉบับจริงใหญ่เท่าไร (ก่อนเบราว์เซอร์ย่อ) เพื่อรายงานผลรวมให้ถูก
    fd.set("originalBytes", String(before));

    const pct = before > 0 ? Math.round((1 - after / before) * 100) : 0;
    setPrep(
      `ย่อในเครื่องแล้ว ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB (${pct}%) · กำลังอัปโหลด…`,
    );

    startTransition(() => action(fd));
    if (inputRef.current) inputRef.current.value = "";
  }

  const working = pending || busy;

  return (
    <div className="border border-line-2 p-5 mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="th text-[15px] font-medium">รูปภาพ</h3>
          <p className="th text-[12px] text-muted mt-1">
            ทั้งหมด {images.length} รูป · รูปแรกคือรูปปก · ระบบย่อและแปลงเป็น
            WebP ให้อัตโนมัติ
          </p>
        </div>

        <form ref={formRef}>
          <input
            ref={inputRef}
            type="file"
            name="files"
            accept="image/*"
            multiple
            disabled={working}
            onChange={onPick}
            className="th text-[12.5px] file:th file:text-[12.5px] file:mr-3 file:px-4 file:py-2 file:border file:border-line-2 file:bg-paper file:cursor-pointer hover:file:border-ink"
          />
        </form>
      </div>

      {(prep || working) && (
        <p className="th mt-3 text-[12.5px] text-ink-2">
          {working && !prep ? "กำลังอัปโหลด…" : prep}
        </p>
      )}

      {state.message && !working && (
        <p
          className={`th mt-3 text-[12.5px] ${
            state.ok ? "text-ink-2" : "text-[#a33]"
          }`}
        >
          {state.message}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
          {images.map((img, i) => (
            <figure key={img.id} className="border border-line-2">
              <div className="relative aspect-[4/3] bg-sand">
                <Image
                  src={img.thumb_url || img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-0 top-0 th text-[10.5px] px-2 py-1 bg-ink text-paper">
                    ปก
                  </span>
                )}
              </div>

              <figcaption className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <MiniForm
                    action={movePropertyImage}
                    fields={{ id: img.id, dir: "up" }}
                    label="←"
                    disabled={i === 0}
                  />
                  <MiniForm
                    action={movePropertyImage}
                    fields={{ id: img.id, dir: "down" }}
                    label="→"
                    disabled={i === images.length - 1}
                  />
                </div>
                <MiniForm
                  action={deletePropertyImage}
                  fields={{ id: img.id }}
                  label="ลบ"
                  confirm
                />
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniForm({
  action,
  fields,
  label,
  disabled,
  confirm,
}: {
  action: (p: UploadState, f: FormData) => Promise<UploadState>;
  fields: Record<string, string | number>;
  label: string;
  disabled?: boolean;
  confirm?: boolean;
}) {
  const [, formAction, pending] = useActionState(action, INIT);
  const [armed, setArmed] = useState(false);

  if (confirm && !armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className={btn}
        disabled={disabled}
      >
        {label}
      </button>
    );
  }

  return (
    <form action={formAction} className="inline">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={String(v)} />
      ))}
      <button
        type="submit"
        disabled={disabled || pending}
        className={`${btn} ${confirm ? "border-[#a33] text-[#a33]" : ""}`}
      >
        {pending ? "…" : confirm ? "ยืนยันลบ" : label}
      </button>
    </form>
  );
}
