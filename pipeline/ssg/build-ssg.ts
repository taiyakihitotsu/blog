import fs from "node:fs";
import path from "node:path";
import { docDir as _docDir } from "../../shared/common.js";
import { handleRequest } from "../server/handleRequest.js";

const BASE_URL = "https://example.com";
const distDir = path.resolve(process.cwd(), "dist");

/**
 * Extracts static paths from the document directory.
 * Consistent with the logic in server.tsx.
 */
const getStaticPaths = (): string[] => {
  const docDir = path.resolve(process.cwd(), _docDir);
  if (!fs.existsSync(docDir)) return ["/"];

  const files = fs.readdirSync(docDir);
  const docPaths = files
    .filter((f) => f.endsWith(".md"))
    .map((f) => `/docs/${f.replace(".md", "")}`);

  return ["/", ...docPaths];
};

const writeRobots = async (): Promise<void> => {
  const outputPath = path.join(distDir, "robots.txt");
  const text = `
User-agent: *
Disallow: /docs

Sitemap: ${BASE_URL}/sitemap.xml
`;
  await fs.promises.writeFile(outputPath, text.trim(), "utf-8");
  console.log(`Generated: ${outputPath}`);
};

const writeSitemap = async (routes: string[]): Promise<void> => {
  const outputPath = path.join(distDir, "sitemap.xml");
  const now = new Date().toISOString();

  const urls = routes
    .map((route) => {
      return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  await fs.promises.writeFile(outputPath, sitemap, "utf-8");
  console.log(`Generated: ${outputPath}`);
};

const writeHeaders = async (): Promise<void> => {
  const outputPath = path.join(distDir, "_headers");

  const text = `
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: https://img.shields.io; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self';
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;

  await fs.promises.writeFile(outputPath, text.trim(), "utf-8");
  console.log(`Generated: ${outputPath}`);
};

// -----------------
// -- Main
// -----------------

const main = async (): Promise<void> => {
  console.log("Starting SSG extraction...");

  try {
    const routes = getStaticPaths();
    console.log("Extracted routes:", routes);

    // 1. Generate HTML files for each route
    // handleRequest internally handles fs.writeFileSync in the updated logic.
    await Promise.all(
      routes.map(async (route) => {
        // Direct execution instead of app.request(route)
        await handleRequest(route)();
      }),
    );

    // 2. Generate supplemental SEO files
    await Promise.all([writeRobots(), writeSitemap(routes), writeHeaders()]);

    console.log("✅ SSG Complete!");
  } catch (error) {
    // Immediate shutdown to ensure the build process fails correctly.
    console.error("❌ SSG Failed:", error);
    process.exit(1);
  }
};

main();
