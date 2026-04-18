import remarkGfm from "remark-gfm";
import { removeFrontMatter } from "./front-matter.js";
import { injectTableOfContents } from "./toc.js";

export const remarkPlugins = [remarkGfm, injectTableOfContents, removeFrontMatter];
