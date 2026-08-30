const { chromium } = require("@playwright/test");

const B = "http://127.0.0.1:8025";
const DETAIL = B + "/property/" + encodeURIComponent("แอชตัน-อโศก");

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });

  await page.goto(DETAIL, { waitUntil: "load" });
  await page.waitForTimeout(1200);

  // scroll to map so lazy chunk + tiles load
  await page.locator('[role="application"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(3500);

  console.log("map container:", await page.locator(".leaflet-container").count());
  const tiles = await page.evaluate(
    () =>
      [...document.querySelectorAll(".leaflet-tile")].filter(
        (t) => t.complete && t.naturalWidth > 0,
      ).length,
  );
  console.log("tiles loaded:", tiles);
  console.log("markers:", await page.locator(".leaflet-marker-icon").count());
  console.log("attribution:", await page.locator(".leaflet-control-attribution").innerText());

  // POI list
  const poiRows = await page.locator("li:has-text('เดิน')").count();
  console.log("poi rows with walk time:", poiRows);

  await page.screenshot({ path: "/tmp/condo-map.png" });

  // nearby section
  const nearbyHead = await page.locator("text=อสังหาฯ ในพื้นที่ใกล้เคียง").count();
  console.log("nearby section:", nearbyHead);
  if (nearbyHead) {
    await page.locator("text=อสังหาฯ ในพื้นที่ใกล้เคียง").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600);
    const badges = await page.locator("span:text-matches('^\\\\d+(\\\\.\\\\d+)? (ม\\\\.|กม\\\\.)$')").count();
    console.log("distance badges:", badges);
    await page.screenshot({ path: "/tmp/condo-nearby.png" });
  }

  // geo in JSON-LD
  const geo = await page.evaluate(() => {
    const s = [...document.querySelectorAll('script[type="application/ld+json"]')];
    for (const el of s) {
      const d = JSON.parse(el.textContent);
      if (d.geo) return d.geo;
    }
    return null;
  });
  console.log("JSON-LD geo:", JSON.stringify(geo));

  console.log("JS errors:", errors.length ? errors : "none");
  await browser.close();
})();
