const { chromium } = require("@playwright/test");

const B = "http://127.0.0.1:8025";

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });

  // 1. validation: bad phone must be rejected
  await page.goto(B + "/contact", { waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.fill('input[name="name"]', "ทดสอบ ระบบ");
  await page.fill('input[name="phone"]', "abc");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1600);
  console.log("bad phone rejected:", await page.locator("text=เบอร์โทรไม่ถูกต้อง").count());

  // 2. valid submit
  await page.fill('input[name="phone"]', "081 000 1234");
  await page.fill('input[name="email"]', "qa@example.com");
  await page.fill('textarea[name="message"]', "ทดสอบระบบ lead อัตโนมัติ ลบได้เลย");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const okMsg = await page.locator("text=ส่งข้อมูลเรียบร้อยแล้ว").count();
  console.log("success message:", okMsg);
  await page.screenshot({ path: "/tmp/condo-lead-ok.png" });

  // 3. honeypot: filled company => silently accepted, no DB row
  await page.goto(B + "/contact", { waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.fill('input[name="name"]', "บอทสแปม");
  await page.fill('input[name="phone"]', "099 999 9999");
  await page.evaluate(() => {
    document.querySelector('input[name="company"]').value = "spam-bot-co";
  });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  console.log("honeypot accepted silently:", await page.locator("text=ส่งข้อมูลเรียบร้อยแล้ว").count());

  // 4. timeline filter
  await page.goto(B + "/about", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await page.locator('a:has-text("ขายขาด")').first().click();
  await page.waitForTimeout(1400);
  console.log("about url:", decodeURIComponent(page.url()));
  console.log("deal cards after filter:", await page.locator('ol li').count());
  await page.screenshot({ path: "/tmp/condo-timeline.png" });

  // 5. journal tag filter
  await page.goto(B + "/journal", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await page.locator('a:has-text("ทำเล (")').first().click();
  await page.waitForTimeout(1400);
  console.log("journal url:", decodeURIComponent(page.url()));

  // 6. deal detail
  await page.goto(B + "/about", { waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.locator('ol li a').first().click();
  await page.waitForTimeout(1600);
  console.log("deal page url:", decodeURIComponent(page.url()).includes("/deal/"));
  await page.screenshot({ path: "/tmp/condo-deal.png" });

  console.log("JS errors:", errors.length ? errors : "none");
  await browser.close();
})();
