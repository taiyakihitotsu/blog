import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { remarkPlugins } from "./pipeline/mdx/index";
import { resolveConfig } from "./vite.config.resolve";

export default defineConfig({
  ...resolveConfig,
  ssr: { noExternal: true },
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
              langs: ["typescript", "javascript", "tsx", "jsx", "bash", "markdown", "json"],
            },
          ],
        ],
      }),
    },
    react(),
  ],
  server: {
    fs: { allow: [".."] },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";

            if (/(gsap|scheduler)/.test(id)) {
              return "vendor-gsap";
            }

            if (
              /shiki|shikiji|hast|unified|mdx|remark|rehype|vfile|unist|micromark|decode-named-character-entities|character-entities/.test(
                id,
              )
            ) {
              return "vendor-shiki";
            }

            if (/mathjs|typed-function|complex\.js|decimal\.js|fraction\.js/.test(id)) {
              return "vendor-math";
            }

            return "vendor-libs";
          }

          if (id.endsWith(".md") || id.endsWith(".mdx")) {
            return "content-posts";
          }
        },
      },
    },
  },
});
