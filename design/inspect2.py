"""ตัด section ตามชื่อหัวข้อจริง แล้วพิมพ์โครงของ 'กล่องรายการ' ในนั้น"""
import re, sys

DIR = "/home/mark/condo/design/themes-src"

def desktop(code):
    s = open(f"{DIR}/{code}.html", encoding="utf-8").read()
    i = s.find("Desktop · 1440")
    j = s.find("Mobile · 390")
    return s[i : j if j > i else len(s)]

def block(html, anchor, stop):
    """ตัดตั้งแต่ div ที่ครอบ anchor ไปจนถึงก่อน stop"""
    i = html.find(anchor)
    if i < 0:
        return ""
    j = html.find(stop, i)
    # ถอยขึ้นไปหา <div เปิดที่ใกล้ที่สุดก่อน anchor 600 ตัวอักษร
    k = html.rfind("<div", max(0, i - 900), i)
    return html[k if k > 0 else i : j if j > i else len(html)]

def skel(html, limit=40):
    out, depth = [], 0
    KEEP = ["display", "grid-template-columns", "grid-column", "flex-direction",
            "height", "min-height", "aspect-ratio", "padding", "gap", "background",
            "text-align", "border", "border-radius", "position", "align-items",
            "justify-content", "max-width", "writing-mode", "order"]
    for m in re.finditer(r"<(/?)(\w[\w-]*)([^>]*)>", html):
        close, tag, attrs = m.group(1), m.group(2), m.group(3)
        if tag in ("br", "path", "svg", "circle", "line", "polyline", "rect", "g"):
            continue
        if close:
            depth = max(0, depth - 1)
            continue
        st = re.search(r'style="([^"]*)"', attrs)
        st = re.sub(r"\s+", " ", st.group(1)) if st else ""
        keep = []
        for k in KEEP:
            mm = re.search(rf"(?:^|;)\s*{k}:\s*([^;]+)", st)
            if mm:
                keep.append(f"{k}:{mm.group(1).strip()[:44]}")
        txt = ""
        nxt = html[m.end() : m.end() + 70]
        t = re.match(r"\s*([^<]{1,40})", nxt)
        if t and t.group(1).strip():
            txt = ' "' + t.group(1).strip()[:32] + '"'
        out.append(("  " * min(depth, 12)) + f"<{tag}>{txt} " + "; ".join(keep[:7]))
        depth += 1
        if len(out) >= limit:
            break
    return out

SEC = {
    "areas": ("ทำเลที่คนมองหา", "ทรัพย์ในระบบ"),
    "stats": ("ทรัพย์ในระบบ", "บทความล่าสุด"),
    "journal": ("บทความล่าสุด", "Develop By"),
    "footer": ("Develop By", "ZZZZ"),
    "propsHead": ("ทรัพย์คัดสรร", "คอนโดมิเนียม"),
}

if __name__ == "__main__":
    code, what = sys.argv[1], sys.argv[2]
    a, b = SEC[what]
    d = desktop(code)
    seg = block(d, a, b)
    print(f"===== {code} / {what} ({len(seg)} chars)")
    for l in skel(seg, int(sys.argv[3]) if len(sys.argv) > 3 else 34):
        print(l)
