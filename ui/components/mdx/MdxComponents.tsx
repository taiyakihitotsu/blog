import type { ComponentPropsWithoutRef } from "react";
import type MDXComponents from "@/../shared/mdx.js";
import { colors } from "@/common/color.js";
import { BlockQuoteComponent } from "@/components/mdx/BlockQuoteComponent.js";
import { DivTableComponent } from "@/components/mdx/DivTableComponent.js";
import { NavComponent } from "@/components/mdx/NavComponent.js";
import { VideoComponent } from "@/components/mdx/VideoComponent.js";
import { layout } from "@/engine/layout.js";
import { handleHeaderClick } from "@/lib/handler/handleHeaderClick.js";
import { generateId } from "@/lib/id/generateId.js";

const createHeader = (Tag: "h1" | "h2" | "h3") => {
  const HeaderComponent = (props: ComponentPropsWithoutRef<"h1" | "h2" | "h3">) => {
    const id = generateId(props.children);

    return (
      <Tag {...props} id={id} onClick={() => handleHeaderClick(id)} style={{ cursor: "pointer" }}>
        {props.children}
      </Tag>
    );
  };
  return HeaderComponent;
};

const mdxPreStyle = {
  ...layout.mdxPre,
  border: `1px solid ${colors.preBorder}`,
  borderRadius: "16px",
  backgroundColor: colors.preBack,
  overflow: "hidden",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  overflowWrap: "anywhere",
} as const;

/** ==================
      Main
=================== */

export const mdxComponents: typeof MDXComponents = {
  // Code snippet (outer)
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
    return (
      <pre {...props} style={{ ...mdxPreStyle, ...props.style }}>
        {children}
      </pre>
    );
  },
  // biome-ignore lint/style/useNamingConvention: custom component.
  Video: VideoComponent,

  blockquote: BlockQuoteComponent,

  h1: createHeader("h1"),
  h2: createHeader("h2"),
  h3: createHeader("h3"),

  // Current transform spec for front-matter.
  //
  // - tags, author: Delete.
  // - title, date: Generate table.
  nav: NavComponent,
  "div-table": DivTableComponent,
} as const;
