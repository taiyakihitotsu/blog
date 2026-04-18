import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const getTestPaths = () => {
  const docDir = path.resolve(process.cwd(), "content/typescript/docs");
  const paths = ["/"];

  if (fs.existsSync(docDir)) {
    const files = fs.readdirSync(docDir);
    const docPaths = files
      .filter((f: string) => f.endsWith(".md"))
      .map((f: string) => `/docs/${f.replace(".md", "")}`);
    paths.push(...docPaths);
  }
  return paths;
};

const allPaths = getTestPaths();

test.describe("Strict Zero-Error & Hydration Integrity Scan", () => {
  for (const route of allPaths) {
    test(`Route: "${route}" - Strict Check`, async ({ page }) => {
      const issues: string[] = [];

      page.on("pageerror", (exception) => {
        issues.push(`[Uncaught Exception]: ${exception.message}`);
      });

      page.on("console", (msg) => {
        const type = msg.type();
        const text = msg.text();

        if (type === "error" || type === "warning") {
          issues.push(`[Console ${type.toUpperCase()}]: ${text}`);
        }
      });

      page.on("requestfailed", (request) => {
        issues.push(`[Request Failed]: ${request.url()} - ${request.failure()?.errorText}`);
      });

      const response = await page.goto(route, { waitUntil: "networkidle" });

      if (!response || response.status() !== 200) {
        issues.push(`[HTTP Status]: ${response?.status()} for ${route}`);
      }

      await page.waitForTimeout(1000);

      if (issues.length > 0) {
        console.error(`\n❌ Strict Check Failed for: ${route}`);
        for (const issue of issues) {
          console.error(`  - ${issue}`);
        }
      }

      expect(issues, `Zero-Tolerance policy violated on route: ${route}`).toHaveLength(0);
    });
  }
});
