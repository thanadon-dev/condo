const { chromium } = require("@playwright/test");

const B = "http://127.0.0.1:8025";

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });

  // 1. favorites empty
  await page.goto(B + "/favorites", { waitUntil: "networkidle" });
  console.log("empty favs:", await page.locator("text=ยังไม่มีทรัพย์ที่เก็บไว้").count());

  // 2. go to properties, click 2 hearts
  await page.goto(B + "/properties", { waitUntil: "networkidle" });
  const hearts = page.locator('button[aria-label="เก็บไว้ในรายการโปรด"]');
  console.log("hearts on page:", await hearts.count());
  await hearts.nth(0).click();
  await hearts.nth(0).click();
  await page.waitForTimeout(300);
  const stored = await page.evaluate(() => localStorage.getItem("condo:favs"));
  console.log("localStorage:", stored);

  // 3. favorites page shows them
  await page.goto(B + "/favorites", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  console.log("saved count text:", await page.locator("text=/เก็บไว้ \\d+ รายการ/").innerText().catch(() => "MISSING"));
  await page.screenshot({ path: "/tmp/condo-favorites.png" });

  // 4. filter interaction: click a category chip, URL must change
  await page.goto(B + "/properties", { waitUntil: "networkidle" });
  await page.locator("button", { hasText: /^คอนโด \(/ }).first().click();
  await page.waitForTimeout(900);
  console.log("url after chip:", decodeURIComponent(page.url()));
  console.log("count text:", await page.locator("text=/พบ \\d+ จาก \\d+ รายการ/").innerText());
  await page.screenshot({ path: "/tmp/condo-filter.png" });

  // 5. sort select
  await page.selectOption("select", "price-asc");
  await page.waitForTimeout(900);
  console.log("url after sort:", decodeURIComponent(page.url()));

  // 6. hero search
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.fill('input[aria-label="ค้นหาทำเลหรือโครงการ"]', "สาทร");
  await page.click('button:has-text("ค้นหา")');
  await page.waitForTimeout(1200);
  console.log("url after hero:", decodeURIComponent(page.url()));
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/tmp/condo-home2.png" });

  console.log("JS errors:", errors.length ? errors : "none");
  await browser.close();
})();
