const { chromium } = require("@playwright/test");

const B = "http://127.0.0.1:8025";
const DETAIL = B + "/property/" + encodeURIComponent("เดอะ-ริเวอร์-เรสซิเดนซ์");

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });

  await page.goto(DETAIL, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((i) => ({
      src: i.currentSrc || i.src,
      w: i.naturalWidth,
    })),
  );
  console.log("images on detail:", imgs.length);
  console.log("optimized?", imgs.every((i) => i.src.includes("/_next/image")));
  console.log("all loaded?", imgs.every((i) => i.w > 0));
  await page.screenshot({ path: "/tmp/condo-detail3.png" });

  // open lightbox
  await page.click('button[aria-label="ดูรูปขนาดเต็ม"]');
  await page.waitForTimeout(900);
  console.log("lightbox open:", await page.locator('[role="dialog"]').count());
  console.log("counter:", await page.locator('[role="dialog"] >> text=/^\\d+ \\/ \\d+$/').innerText());
  console.log("body locked:", await page.evaluate(() => document.body.style.overflow));
  await page.screenshot({ path: "/tmp/condo-lightbox.png" });

  // arrow right
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  console.log("after ArrowRight:", await page.locator('[role="dialog"] >> text=/^\\d+ \\/ \\d+$/').innerText());

  // wrap-around backwards from 2 -> 1
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(500);
  console.log("wrap backwards:", await page.locator('[role="dialog"] >> text=/^\\d+ \\/ \\d+$/').innerText());

  // ESC closes
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  console.log("closed:", (await page.locator('[role="dialog"]').count()) === 0);
  console.log("body restored:", JSON.stringify(await page.evaluate(() => document.body.style.overflow)));

  // grid cards have real images
  await page.goto(B + "/properties", { waitUntil: "load" });
  await page.waitForTimeout(1800);
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll("img")].filter((i) => i.naturalWidth > 0).length,
  );
  console.log("loaded card images:", cards);
  await page.screenshot({ path: "/tmp/condo-grid.png" });

  await page.goto(B + "/", { waitUntil: "load" });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: "/tmp/condo-home3.png", fullPage: false });

  console.log("JS errors:", errors.length ? errors : "none");
  await browser.close();
})();
