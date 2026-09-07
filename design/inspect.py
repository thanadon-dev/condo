"""สกัดโครงสร้างแต่ละ section ของทั้ง 10 ธีม เพื่อหาว่าต้องทำ variant กี่แบบต่อจุด"""
import re, json, os

DIR = "/home/mark/condo/design/themes-src"
CODES = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a"]

def desktop(code):
    s = open(f"{DIR}/{code}.html", encoding="utf-8").read()
    i = s.find("Desktop · 1440")
    j = s.find("Mobile · 390")
    return s[i:j if j > i else len(s)]

def outline(html, maxdepth=99):
    """แปลง html เป็นโครงสร้างย่อ: tag + style ที่สำคัญ"""
    out = []
    depth = 0
    for m in re.finditer(r"<(/?)(\w[\w-]*)([^>]*)>", html):
        close, tag, attrs = m.group(1), m.group(2), m.group(3)
        if tag in ("br", "path", "svg", "circle", "line", "rect"):
            continue
        if close:
            depth -= 1
            continue
        st = re.search(r'style="([^"]*)"', attrs)
        st = re.sub(r"\s+", " ", st.group(1)) if st else ""
        keep = []
        for k in ["display", "grid-template-columns", "flex-direction", "height",
                  "min-height", "position", "padding", "gap", "background",
                  "text-align", "align-items", "justify-content", "aspect-ratio",
                  "border-radius", "max-width", "margin"]:
            mm = re.search(rf"(?:^|;)\s*{k}:\s*([^;]+)", st)
            if mm:
                keep.append(f"{k}:{mm.group(1).strip()}")
        out.append(("  " * min(depth, 14)) + f"<{tag}> " + "; ".join(keep[:6]))
        if attrs.rstrip().endswith("/"):
            continue
        depth += 1
    return out

if __name__ == "__main__":
    import sys
    code = sys.argv[1]
    what = sys.argv[2] if len(sys.argv) > 2 else "hero"
    d = desktop(code)

    MARK = {
        "header": ("Desktop · 1440", "BANGKOK · REAL ESTATE"),
        "hero": ("BANGKOK · REAL ESTATE", "ทำเล / โครงการ"),
        "search": ("ทำเล / โครงการ", "ทรัพย์คัดสรร"),
        "areas": ("ทำเลที่คนมองหา", "ทรัพย์ในระบบ"),
        "stats": ("ทรัพย์ในระบบ", "บทความล่าสุด"),
        "journal": ("บทความล่าสุด", "Develop By"),
    }
    a, b = MARK[what]
    i, j = d.find(a), d.find(b)
    # ถอยขึ้นไปหา tag เปิดที่ครอบข้อความนั้น
    i = max(0, d.rfind("<div", 0, i - 400) if i > 400 else 0)
    seg = d[i : j if j > i else len(d)]
    print(f"===== {code} / {what} ({len(seg)} chars)")
    for line in outline(seg)[:70]:
        print(line)
