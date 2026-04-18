import { docDir, docPageAddress } from "../../shared/common.js";
import type { MdxModule } from "../../shared/mdx.js";

const posts = import.meta.glob<MdxModule>("/content/typescript/docs/*.md", { eager: true });

export const getFrontMatter = (p: string): Record<string, string> => {
  if (p === "/") {
    return {
      // Defer the use of 'genTitle' as it is applied during the final template injection
      // in 'pipeline/server/handleRequest.ts'.
      title: "Profile",
      description: "@taiyakihitotsu",
    };
  }

  const slug = p.replace(docPageAddress, "");
  const fileKey = `/${docDir}/${slug}.md`;

  const mod = posts[fileKey];

  return mod?.frontmatter ?? {};
};
