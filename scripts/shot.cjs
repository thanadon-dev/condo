const { chromium } = require("playwright");

const SHOTS = [
  ["/", "home"],
  ["/properties", "properties"],
  ["/property/" + encodeURIComponent("เดอะ-ริเวอร์-เรสซิเดนซ์"), "detail"],
  ["/journal/" + encodeURIComponent("เจ็ดจุดที่ควรตรวจก่อนเซ็นสัญญาเช่า"), "article"],
  ["/about", "about"],
];

(async () => {
  const browser = await chromium.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });

  for (const [path, name] of SHOTS) {
    const url = "http://127.0.0.1:8025" + path;
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `/tmp/condo-${name}.png`, fullPage: false });
    console.log(res.status(), name, path);
  }

  console.log("JS errors:", errors.length ? errors : "none");
  await browser.close();
})();
