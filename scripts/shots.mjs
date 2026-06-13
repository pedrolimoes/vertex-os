import puppeteer from "puppeteer-core";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3000";
const OUT = "docs/screenshots";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle(page, ms = 1200) {
  try {
    await page.evaluate(() => document.fonts && document.fonts.ready);
  } catch {}
  await sleep(ms);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb"],
});

const page = await browser.newPage();

try {
  // ---- 1. Hero — the cinematic landing ----
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 60000 });
  await settle(page, 1800);
  await page.screenshot({ path: `${OUT}/hero.png` });
  console.log("✓ hero.png");

  // ---- 2. Generator — the discovery brief, filled in ----
  await page.goto(`${BASE}/studio/generator`, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await settle(page, 1000);
  // Give the brief some life so it doesn't look empty.
  await page.evaluate(() => {
    const inp = document.querySelector('input[placeholder="Meridian Coatings"]');
    if (inp) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      ).set;
      setter.call(inp, "Aurora Detailing Co.");
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await settle(page, 700);
  await page.screenshot({ path: `${OUT}/generator.png` });
  console.log("✓ generator.png");

  // ---- Generate a real project so editor/export have content ----
  // Jump to the final discovery step (the numbered "10" chip) so the
  // Generate button renders.
  await page.evaluate(() => {
    const step10 = [...document.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === "10",
    );
    if (step10) step10.click();
  });
  await sleep(700);
  // Click Generate (poll briefly in case it's still mounting).
  for (let i = 0; i < 10; i++) {
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => /Generate the site/i.test(b.textContent) && !b.disabled,
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (clicked) break;
    await sleep(400);
  }
  // Wait for the engine to produce + save the project.
  let siteId = null;
  for (let i = 0; i < 30; i++) {
    siteId = await page.evaluate(() => {
      const projs = JSON.parse(localStorage.getItem("vss:projects-v1") || "[]");
      return projs[0] ? projs[0].id : null;
    });
    if (siteId) break;
    await sleep(500);
  }
  if (!siteId) throw new Error("no project generated");
  console.log("  generated project", siteId);

  // ---- 3. Editor — the visual workspace ----
  await page.goto(`${BASE}/studio/editor?site=${siteId}`, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await settle(page, 2000);
  await page.screenshot({ path: `${OUT}/editor.png` });
  console.log("✓ editor.png");

  // ---- 4. Export — the export guide modal ----
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      /export website/i.test(b.textContent),
    );
    if (btn) btn.click();
  });
  await settle(page, 900);
  await page.screenshot({ path: `${OUT}/export.png` });
  console.log("✓ export.png");
} finally {
  await browser.close();
}
