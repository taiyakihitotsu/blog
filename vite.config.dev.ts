import fs from "node:fs";
import path from "node:path";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { remarkPlugins } from "./pipeline/mdx/index.js";
import { parseMetadataToRecord } from "./pipeline/mdx/parseMetadataToRecord.js";
import { resolveConfig } from "./vite.config.resolve";

export function ssrInjectPlugin() {
  return {
    name: "ssr-inject",
    transformIndexHtml(html, ctx) {
      const url = new URL(ctx.originalUrl || "/", "http://localhost");
      const urlPath = url.pathname;

      console.log("url:", url);

      let title = "Profile";
      let description = "Profile";

      if (urlPath !== "/") {
        const slug = urlPath.replace(/^\/docs/, "");
        const filePath = path.resolve(process.cwd(), `content/typescript/docs/${slug}.md`);

        console.log(filePath);

        if (fs.existsSync(filePath)) {
          const rawContent = fs.readFileSync(filePath, "utf-8");
          const metadata = parseMetadataToRecord(rawContent);

          title = metadata.title || title;
          description = metadata.description || description;
        }
      }

      /** Replacing metadata in the shell HTML */
      return html
        .replace(`<title>`, `<title>${title}`)
        .replace(`</head>`, `<meta name="description" content="${description}" /></head>`);
    },
  };
}

export default defineConfig({
  ...resolveConfig,
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: remarkPlugins,
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: { light: "github-light", dark: "github-dark" },
            },
          ],
        ],
      }),
    },
    react(),
    ssrInjectPlugin(),
  ],
  server: {
    fs: { allow: [".."] },
  },
});
