import { expect, test } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

// Type def for PerformanceObserver
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Force single worker for this file to avoid port 9222 conflict
test.describe.configure({ mode: "serial" });

test.describe("Performance and SSG Integration Tests", () => {
  test("Lighthouse performance audit", async ({ page, baseURL }) => {
    if (!baseURL) {
      throw new Error("baseURL is not defined in playwright.config.ts.");
    }

    // Extend timeout for Lighthouse
    test.setTimeout(90000);

    await page.goto("/");

    await playAudit({
      page: page,
      thresholds: {
        performance: 90,
        accessibility: 90,
        "best-practices": 90,
        seo: 80,
      },
      port: 9222,
      url: baseURL,
      reports: {
        formats: {
          json: true,
        },
        name: `lighthouse-report-${Date.now()}`,
        directory: "test-results/lighthouse",
      },
    });
  });

  test("Should have minimal Cumulative Layout Shift (CLS) during hydration", async ({ page }) => {
    await page.goto("/");

    const cls = await page.evaluate((): Promise<number> => {
      return new Promise<number>((resolve) => {
        let score = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shiftEntry = entry as LayoutShift;
            if (!shiftEntry.hadRecentInput) {
              score += shiftEntry.value;
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });

        // Resolve after 3 seconds anyway to avoid timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(score);
        }, 3000);
      });
    });

    console.log(`Measured CLS: ${cls}`);
    expect(cls).toBeLessThan(0.1);
  });

  test("Should reset scroll position to top on navigation", async ({ page }) => {
    await page.goto("/");

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));

    // Click a link to navigate
    // Adjust selector to match your actual navigation link
    const navLink = page.locator('nav a[href*="/docs/"]').first();
    await navLink.click();

    // Wait for scroll to reset (Retry until it passes)
    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(0);
    }).toPass({
      intervals: [100, 200, 500],
      timeout: 5000,
    });
  });

  test("Elements should become visible when scrolled into view (GSAP)", async ({ page }) => {
    await page.goto("/");
    const title = page.locator("h1#about-me");

    const initialOpacity = await title.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(initialOpacity)).toBeLessThan(1);

    await title.scrollIntoViewIfNeeded();

    await expect(async () => {
      const opacity = await title.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(Number(opacity)).toBeGreaterThan(0);
    }).toPass({
      intervals: [100, 200, 500],
      timeout: 5000,
    });
  });
});
