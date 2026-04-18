import fs from "node:fs";
import path from "node:path";
import { renderToString } from "react-dom/server";
import App from "@/App.js";
import { genTitle } from "../../shared/common.js";
import { getFrontMatter } from "./getFrontMatter.js";

const templatePath = path.resolve(process.cwd(), "dist/index.html");
const rawTemplate = fs.readFileSync(templatePath, "utf-8");

const placeholders = {
  meta: "<!--META-->",
  app: "<!--APP-->",
  title: "<!--TITLE-->",
} as const;

const templateValidation = (rawTemplate: string): void => {
  Object.values(placeholders).forEach((placeholder) => {
    if (!rawTemplate.includes(placeholder)) {
      throw new Error(`Template missing placeholder: ${placeholder}`);
    }
  });
};

templateValidation(rawTemplate);

export const sanitize = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const handleRequest = (p: string) => async () => {
  try {
    const appHtml = renderToString(<App path={p} />);

    const { title = "No title", description = "No description" } = getFrontMatter(p);

    console.log(`Rendered path [${p}] with title: ${title}`);

    const finalHtml = rawTemplate
      .replace(placeholders.app, appHtml)
      .replace(placeholders.title, genTitle(title))
      .replace(
        placeholders.meta,
        `<meta name="description" content="${sanitize(description)}" /></head>`,
      );

    const safePath = p.replace(/^\/+/, "").replace(/\.\./g, "");
    const outputPath = path.join(
      process.cwd(),
      "dist",
      safePath === "" ? "index.html" : `${safePath}.html`,
    );
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, finalHtml);
  } catch (e) {
    // Immediate shutdown to ensure the SSG build process fails on error.
    // This prevents shipping an incomplete or broken static site.
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error(`[Build Error] Render failed at path: ${p}`);
    console.error(`Reason: ${errorMessage}`);
    process.exit(1);
  }
};
