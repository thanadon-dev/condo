#!/usr/bin/env bash
set -euo pipefail

OUT="$HOME/autobackup-repo/condo"
DATA="${CONDO_DATA_DIR:-$HOME/.local/share/condo}"
SRC="$DATA/condo.db"
MEDIA="${CONDO_MEDIA_DIR:-$DATA/media}"
mkdir -p "$OUT"

/home/mark/.local/bin/node -e '
const {DatabaseSync,backup}=require("node:sqlite");
const src=process.argv[1], dst=process.argv[2];
const db=new DatabaseSync("file:"+src+"?mode=ro",{readOnly:true});
backup(db,dst).then(()=>{db.close();console.log("db ok")}).catch(e=>{console.error(e);process.exit(1)});
' "$SRC" "$OUT/condo.db"

if [ -d "$MEDIA" ]; then
	tar -czf "$OUT/media.tar.gz" -C "$(dirname "$MEDIA")" "$(basename "$MEDIA")"
	echo "media ok ($(du -sh "$OUT/media.tar.gz" | cut -f1))"
fi

echo "condo backup -> $OUT"
