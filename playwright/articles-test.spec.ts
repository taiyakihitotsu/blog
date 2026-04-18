import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, "../content/typescript/docs");

test.describe("Articles & Table of Contents Integrity Tests", () => {
  test("Verify roundedContent-typescript links match local docs files 1:1", async ({ page }) => {
    // 1. Get local file names (excluding extensions)
    const localFiles = fs
      .readdirSync(DOCS_DIR)
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx?$/, ""))
      .sort();

    await page.goto("/");
    await page.click("#float-jump-list-open-button");

    // 2. Get links from the UI menu
    const menuLinks = page.locator("#roundedContent-typescript a");
    const linkNames = (
      await menuLinks.evaluateAll((elements) =>
        elements.map(
          (el) => (el as HTMLAnchorElement).getAttribute("href")?.split("/").pop() || "",
        ),
      )
    ).filter((name) => name !== "");

    // Check for links in UI that don't have a corresponding local file
    for (const name of linkNames) {
      expect(
        localFiles,
        `[Excess Link] UI link "${name}" does not have a corresponding file in ${DOCS_DIR}`,
      ).toContain(name);
    }

    // Check for local files that don't have a corresponding link in the UI
    for (const file of localFiles) {
      expect(
        linkNames,
        `[Missing Link] File "${file}" does not have a corresponding link in UI (#roundedContent-typescript)`,
      ).toContain(file);
    }
  });

  test("Verify all headers in docs pages correspond to table-of-contents links 1:1", async ({
    page,
    baseURL,
  }) => {
    await page.goto("/");
    await page.click("#float-jump-list-open-button");

    // Retrieve all target URLs to validate
    const docLinks = await page.locator("#roundedContent-typescript a").all();
    const targetUrls: string[] = [];
    for (const link of docLinks) {
      const href = await link.getAttribute("href");
      if (href) targetUrls.push(new URL(href, baseURL).href);
    }

    for (const url of targetUrls) {
      await page.goto(url);
      await page.click("#float-jump-list-open-button");

      // Get headers from the page (using ID or generating one from text content)
      const headerIds = await page.locator("main h1, main h2, main h3").evaluateAll((headers) =>
        headers
          .map((h) => {
            // Use existing ID if available, otherwise generate from text (lowercase + hyphenate)
            const rawId = h.id || h.textContent || "";
            return rawId.toLowerCase().trim().replace(/\s+/g, "-");
          })
          .filter((id) => id !== ""),
      );

      // Get target anchors from the Table of Contents
      const tocHrefs = await page
        .locator(".table-of-contents a")
        .evaluateAll((links) =>
          links.map(
            (l) =>
              (l as HTMLAnchorElement).getAttribute("href")?.replace("#", "").toLowerCase() || "",
          ),
        );

      // Verify headers exist in the TOC
      for (const id of headerIds) {
        expect(
          tocHrefs,
          `\n[Missing TOC Entry]\nURL: ${url}\nExpected ID: "#${id}"\nwas not found in the Table of Contents.`,
        ).toContain(id);
      }

      // Verify TOC links point to an existing header ID
      for (const href of tocHrefs) {
        expect(
          headerIds,
          `\n[Broken TOC Link]\nURL: ${url}\nTOC link: "#${href}"\ndoes not match any header ID in the main content.`,
        ).toContain(href);
      }

      // Final count verification
      expect(tocHrefs.length, `[Count Mismatch] Page: ${url}`).toBe(headerIds.length);
    }
  });
});
