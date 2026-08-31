#!/usr/bin/env bash
# เทียบขนาดรูปที่ next/image ส่งให้ เมื่อเบราว์เซอร์รองรับ AVIF vs WebP
set -uo pipefail
B="http://127.0.0.1:8025"
IMG="/_next/image?url=%2Fmedia%2Fhero-mock.webp&w=1200&q=75"

echo "AVIF:"
curl -s -A M -H "Accept: image/avif,image/webp,*/*" "$B$IMG" -o /dev/null -D - -w "  size=%{size_download}B\n" | grep -iE "content-type|size="

echo "WebP:"
curl -s -A M -H "Accept: image/webp,*/*" "$B$IMG" -o /dev/null -D - -w "  size=%{size_download}B\n" | grep -iE "content-type|size="

echo "ต้นฉบับ /media:"
curl -s -A M "$B/media/hero-mock.webp" -o /dev/null -w "  size=%{size_download}B\n"

echo
echo "cache header ของรูป optimized:"
curl -s -A M -H "Accept: image/avif,image/webp,*/*" "$B$IMG" -o /dev/null -D - | grep -iE "cache-control|vary" | head -3
