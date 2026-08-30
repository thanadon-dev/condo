#!/usr/bin/env bash
set -euo pipefail

OUT="$HOME/autobackup-repo/condo"
SRC="${CONDO_DATA_DIR:-$HOME/.local/share/condo}/condo.db"
mkdir -p "$OUT"

/home/mark/.local/bin/node -e '
const {DatabaseSync}=require("node:sqlite");
const src=process.argv[1], dst=process.argv[2];
const db=new DatabaseSync("file:"+src+"?mode=ro",{readOnly:true});
const {backup}=require("node:sqlite");
backup(db,dst).then(()=>{db.close();console.log("ok")}).catch(e=>{console.error(e);process.exit(1)});
' "$SRC" "$OUT/condo.db"

echo "condo backup -> $OUT/condo.db"
