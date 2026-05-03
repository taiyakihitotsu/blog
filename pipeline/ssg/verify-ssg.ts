import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const DIST_DIR = path.resolve(process.cwd(), "dist");

const verify = async () => {
  console.log("🧪 Starting robust SSG verification...");

  const files = getFiles(DIST_DIR).filter((f) => f.endsWith(".html"));

  // Verify that HTML files were actually generated in `dist/`.
  if (files.length === 0) {
    throw new Error("No HTML files found in dist/");
  }

  const contents = new Map<string, { route: string; hash: string; title: string }>();
  const errors: string[] = [];

  for (const file of files) {
    const relativePath = path.relative(DIST_DIR, file);
    const html = fs.readFileSync(file, "utf-8");
    const $ = cheerio.load(html);

    // Check for minimum file size.
    //
    // This test is arbitrary but it has meaning.
    if (html.length < 200) {
      errors.push(`[${relativePath}] File size is too small (${html.length} bytes).`);
    }

    // Ensure the main content area is not empty (checks #root, main, or body).
    const mainContent = $("#root").html() || $("main").html() || $("body").html();
    if (!mainContent || mainContent.trim().length < 50) {
      errors.push(`[${relativePath}] Main content area is empty or too short.`);
    }

    // Verify content uniqueness using SHA-256 hashes.
    const bodyHash = crypto
      .createHash("sha256")
      .update(mainContent || "")
      .digest("hex");

    const title =
      $("title")
        .map((_, el) => $(el))
        .get() // Convert to Array.
        .find(($el) => {
          const text = $el.text().trim();
          const isSvg = $el.closest("svg").length > 0;
          return !isSvg && text.length > 0;
        })
        ?.text()
        .trim() || "";

    // Check if an identical hash already exists from a different route.
    if ([...contents.values()].some((data) => data.hash === bodyHash)) {
      errors.push(`[${relativePath}] Content identical to another page`);
    }

    contents.set(relativePath, { route: relativePath, hash: bodyHash, title });

    // Validate internal link integrity.
    checkInternalLinks($, relativePath, files, errors);
  }

  if (errors.length > 0) {
    console.error("\nVerification Failed:");
    errors.forEach((err) => {
      console.error(`  - ${err}`);
    });
    process.exit(1);
  }

  console.log(`\nVerification Passed! Checked ${contents.size} pages.`);
  console.table(Array.from(contents.values()).map((c) => ({ route: c.route, title: c.title })));
};

const getFiles = (dir: string): string[] => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
};

const checkInternalLinks = (
  $: cheerio.CheerioAPI,
  page: string,
  files: string[],
  errors: string[],
) => {
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    // Skip external links and anchor fragments.
    if (href.startsWith("http") || href.startsWith("#")) return;

    // Normalize to a relative path.
    let targetPath = href.replace(/^\/+/, "");

    // Resolve directory roots to index.html.
    if (href === "/" || href === "" || targetPath.endsWith("/")) {
      targetPath = path.join(targetPath, "index.html");
    } else if (!path.extname(targetPath)) {
      targetPath += ".html";
    }

    targetPath = path.resolve(DIST_DIR, targetPath);

    if (!files.includes(targetPath)) {
      errors.push(`[${page}] Broken internal link: ${href} -> resolved to ${targetPath}`);
    }
  });
};

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
