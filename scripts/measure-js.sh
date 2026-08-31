#!/usr/bin/env bash
# วัดขนาด JS ที่หน้าแรกโหลดจริง (gzip) + TTFB
set -uo pipefail
B="http://127.0.0.1:8025"

curl -s -A M "$B/" -o /tmp/h3.html -w "html=%{size_download}B ttfb=%{time_starttransfer}s total=%{time_total}s\n"

files=$(grep -o '/_next/static/[^"]*\.js' /tmp/h3.html | sort -u)
total=0
count=0
for f in $files; do
	sz=$(curl -s -A M -H "Accept-Encoding: gzip" "$B$f" -o /dev/null -w "%{size_download}")
	total=$((total + sz))
	count=$((count + 1))
done
echo "JS files = $count"
echo "JS gzip total = $total bytes ($((total / 1024)) KB)"
