#!/usr/bin/env bash
# เทียบ JS ระหว่างหน้าแรก vs หน้า detail (ที่มีแผนที่) + ขนาด CSS
set -uo pipefail
B="http://127.0.0.1:8025"

measure() {
	local path="$1" label="$2"
	curl -s -A M "$B$path" -o /tmp/m.html
	local files total=0 count=0
	files=$(grep -o '/_next/static/[^"]*\.js' /tmp/m.html | sort -u)
	for f in $files; do
		sz=$(curl -s -A M -H "Accept-Encoding: gzip" "$B$f" -o /dev/null -w "%{size_download}")
		total=$((total + sz))
		count=$((count + 1))
	done
	local css csstotal=0
	css=$(grep -o '/_next/static/[^"]*\.css' /tmp/m.html | sort -u)
	for f in $css; do
		sz=$(curl -s -A M -H "Accept-Encoding: gzip" "$B$f" -o /dev/null -w "%{size_download}")
		csstotal=$((csstotal + sz))
	done
	echo "$label: JS ${count} ไฟล์ $((total / 1024))KB | CSS $((csstotal / 1024))KB"
}

measure "/" "หน้าแรก      "
measure "/property/ashton-asoke" "หน้า detail  "
measure "/properties" "หน้ารายการ   "

echo
echo "chunk ใหญ่สุด 3 อันดับ (หน้าแรก):"
curl -s -A M "$B/" -o /tmp/m.html
for f in $(grep -o '/_next/static/[^"]*\.js' /tmp/m.html | sort -u); do
	sz=$(curl -s -A M -H "Accept-Encoding: gzip" "$B$f" -o /dev/null -w "%{size_download}")
	echo "$sz $(basename "$f")"
done | sort -rn | head -3
