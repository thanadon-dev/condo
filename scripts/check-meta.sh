#!/usr/bin/env bash
# ตรวจ canonical / OG / description รายหน้า ว่าไม่ซ้ำและไม่ว่าง
set -uo pipefail
B="http://127.0.0.1:8025"

for p in / /properties /property/ashton-asoke /journal /journal/how-to-price-your-rental \
	/about /contact /area/sukhumvit /deal/ashton-asoke-full-year-lease-renewed; do
	html=$(curl -s -A M "$B$p")
	can=$(echo "$html" | grep -o '<link rel="canonical" href="[^"]*"' | sed 's/.*href="//;s/"//')
	ogi=$(echo "$html" | grep -c 'og:image')
	desc=$(echo "$html" | grep -o '<meta name="description" content="[^"]*"' | sed 's/.*content="//;s/"//' | cut -c1-42)
	title=$(echo "$html" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g' | cut -c1-40)
	printf '%-46s og:img=%s\n' "$p" "$ogi"
	printf '   canonical: %s\n' "${can:-ไม่มี}"
	printf '   title:     %s\n' "${title:-ไม่มี}"
	printf '   desc:      %s\n' "${desc:-ไม่มี}"
done
