"""ดึงค่า layout ที่เหลือของทุกธีมแบบละเอียด: hero, search, section wrap, kicker, journal, stats"""
import re, json

DIR = "/home/mark/condo/design/themes-src"
CODES = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a"]


def desktop(c):
    s = open(f"{DIR}/{c}.html", encoding="utf-8").read()
    i = s.find("Desktop · 1440")
    j = s.find("Mobile · 390")
    return s[i : j if j > i else len(s)]


def style_of(html, pat):
    m = re.search(pat, html)
    return re.sub(r"\s+", " ", m.group(1)) if m else ""


def prop(style, key, default=""):
    m = re.search(rf"(?:^|;)\s*{key}:\s*([^;]+)", style)
    return m.group(1).strip() if m else default


out = {}
for c in CODES:
    d = desktop(c)
    r = {}

    # ---- hero ----
    # กล่องที่มี h1 อยู่ข้างใน + พ่อของมัน
    h1i = d.find("<h1")
    pre = d[max(0, h1i - 2600) : h1i]
    divs = re.findall(r'<div style="([^"]*)"', pre)
    r["heroWrapStyles"] = [re.sub(r"\s+", " ", x)[:180] for x in divs[-4:]]
    # ความสูง hero
    hm = re.findall(r"height:\s*(\{\{ heroH \}\}|\d+px)", pre)
    r["heroH"] = hm[-1] if hm else ""
    # hero มีรูปไหม (image-slot ก่อน h1)
    r["heroHasImage"] = "imgslot" in pre[-2200:]
    # h1 อยู่บน overlay (absolute) หรือในบล็อกสี
    r["heroAbsolute"] = "position:absolute" in " ".join(divs[-3:])
    r["heroGrid"] = next(
        (x for x in reversed(divs) if "grid-template-columns" in x), ""
    )[:120]

    # ---- search bar ----
    si = d.find("ทำเล / โครงการ")
    spre = d[max(0, si - 1800) : si]
    sdivs = re.findall(r'<div style="([^"]*)"', spre)
    grid = next((x for x in reversed(sdivs) if "grid-template-columns" in x), "")
    r["searchGrid"] = prop(re.sub(r"\s+", " ", grid), "grid-template-columns")
    r["searchBg"] = prop(re.sub(r"\s+", " ", grid), "background")
    r["searchPad"] = prop(re.sub(r"\s+", " ", grid), "padding")
    r["searchRadius"] = prop(re.sub(r"\s+", " ", grid), "border-radius")
    r["searchBorder"] = prop(re.sub(r"\s+", " ", grid), "border")
    # ตำแหน่งแถบค้นหา: ทับ hero (margin ติดลบ) หรือแยกบล็อก
    outer = next((x for x in reversed(sdivs) if "margin:" in x), "")
    r["searchMargin"] = prop(re.sub(r"\s+", " ", outer), "margin")
    r["searchMaxW"] = prop(re.sub(r"\s+", " ", outer), "max-width")

    # ---- ความกว้างเนื้อหา ----
    mw = re.findall(r"max-width:\s*(\d+)px", d)
    from collections import Counter
    r["wrapMaxW"] = Counter(mw).most_common(3)
    pads = re.findall(r"padding:\s*[\d ]*?(\d+)px;?\s*max-width", d)
    r["wrapPad"] = Counter(re.findall(r"padding:\s*\d+px (\d+)px", d)).most_common(3)

    # ---- areas ----
    ai = d.find("ทำเลที่คนมองหา")
    apost = d[ai : ai + 2600]
    ag = re.search(r'<div style="([^"]*grid-template-columns[^"]*)"', apost)
    r["areasGrid"] = re.sub(r"\s+", " ", ag.group(1))[:150] if ag else ""
    r["areasAspect"] = prop(
        re.sub(r"\s+", " ", apost[:2200]), "aspect-ratio"
    ) or (re.search(r"aspect-ratio:\s*([\d/]+)", apost).group(1) if re.search(r"aspect-ratio:\s*([\d/]+)", apost) else "")
    hm2 = re.search(r"height:\s*(\d+)px", apost)
    r["areasH"] = hm2.group(1) + "px" if hm2 else ""

    # ---- stats ----
    ti = d.find("ทรัพย์ในระบบ")
    tpre = d[max(0, ti - 1400) : ti]
    tdivs = re.findall(r'<div style="([^"]*)"', tpre)
    r["statsItem"] = re.sub(r"\s+", " ", tdivs[-1])[:150] if tdivs else ""
    tg = next((x for x in reversed(tdivs) if "grid-template-columns" in x), "")
    r["statsGrid"] = prop(re.sub(r"\s+", " ", tg), "grid-template-columns")
    tsec = d[max(0, ti - 2400) : ti]
    r["statsBg"] = ""
    for x in re.findall(r'<(?:div|section) style="([^"]*background[^"]*)"', tsec):
        b = prop(re.sub(r"\s+", " ", x), "background")
        if b and not b.startswith("linear"):
            r["statsBg"] = b

    # ---- journal ----
    ji = d.find("บทความล่าสุด")
    jpost = d[ji : ji + 2600]
    jg = re.search(r'<div style="([^"]*grid-template-columns[^"]*)"', jpost)
    r["journalGrid"] = (
        prop(re.sub(r"\s+", " ", jg.group(1)), "grid-template-columns") if jg else "column"
    )
    ja = re.search(r'<a href="[^"]*" style="([^"]*)"', jpost)
    r["journalCard"] = re.sub(r"\s+", " ", ja.group(1))[:170] if ja else ""

    out[c] = r

print(json.dumps(out, ensure_ascii=False, indent=1))
