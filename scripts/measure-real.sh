#!/usr/bin/env bash
# วัดขนาดที่ผู้ใช้จริงได้รับ = ผ่าน Caddy (:8467)
# หมายเหตุ: ใช้ --compressed ให้ curl คลายไฟล์ก่อน grep (ถ้าตั้ง Accept-Encoding เอง curl จะไม่คลายให้)
set -uo pipefail
C="http://127.0.0.1:8467"
H="Host: condo.thanadon.com"

# ขนาด "บนสาย" (บีบแล้ว) — ตัวเลขที่ผู้ใช้ดาวน์โหลดจริง
wire() {
	curl -s -A M -H "$H" -H "Accept-Encoding: zstd, gzip" "$C$1" -o /dev/null -w "%{size_download}"
}

page() {
	local path="$1" label="$2"
	curl -s -A M -H "$H" --compressed "$C$path" -o /tmp/r.html
	local html
	html=$(wire "$path")

	local total=0 count=0
	for f in $(grep -o '/_next/static/[^"]*\.js' /tmp/r.html | sort -u); do
		total=$((total + $(wire "$f")))
		count=$((count + 1))
	done

	local css=0
	for f in $(grep -o '/_next/static/[^"]*\.css' /tmp/r.html | sort -u); do
		css=$((css + $(wire "$f")))
	done

	printf '%-12s HTML %5dB | JS %2d ไฟล์ %3dKB | CSS %2dKB | รวม %3dKB\n' \
		"$label" "$html" "$count" "$((total / 1024))" "$((css / 1024))" \
		"$(((html + total + css) / 1024))"
}

page "/" "หน้าแรก"
page "/properties" "รายการ"
page "/property/ashton-asoke" "รายละเอียด"
page "/journal" "บทความ"
