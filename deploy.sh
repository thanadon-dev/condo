#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

if [ -n "$(git status --porcelain)" ]; then
	echo "หยุด: ยังมีไฟล์ที่ยังไม่ commit"
	git status --short
	exit 1
fi

echo "==> build"
npm run build

echo "==> ล้าง image cache (รูปเสิร์ฟแบบ immutable ชื่อไฟล์เดิม)"
rm -rf .next/cache/images

echo "==> restart service"
systemctl --user restart condo
sleep 6

systemctl --user is-active condo

echo "==> health"
curl -fsS --max-time 15 http://127.0.0.1:8025/api/health
echo

echo "==> โดเมนจริง"
for p in / /properties /journal /about /contact /login; do
	code=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" --max-time 25 "https://condo.thanadon.com$p")
	echo "  $code  $p"
done

echo "deploy เสร็จ: https://condo.thanadon.com"
