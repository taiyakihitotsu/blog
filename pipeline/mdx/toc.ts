import type { Root, RootContent, Text } from "mdast";
import type { MdxJsxFlowElement } from "../../shared/mdx.js";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const genMdxLink = (text: string, href: string): MdxJsxFlowElement => ({
  type: "mdxJsxFlowElement",
  name: "a",
  attributes: [{ type: "mdxJsxAttribute", name: "href", value: href }],
  children: [{ type: "text", value: text }],
});

type TocItem = {
  text: string;
  depth: number;
  children: TocItem[];
};

const buildTocTree = (headings: { text: string; depth: number }[]): TocItem[] => {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];
  for (const { text, depth } of headings) {
    const newItem: TocItem = { text, depth, children: [] };
    while (stack.length > 0 && (stack[stack.length - 1] as TocItem).depth >= depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      root.push(newItem);
    } else {
      (stack[stack.length - 1] as TocItem).children.push(newItem);
    }
    stack.push(newItem);
  }
  return root;
};

const renderTocTree = (items: TocItem[]): MdxJsxFlowElement | null => {
  if (items.length === 0) return null;

  return {
    type: "mdxJsxFlowElement",
    name: "ul",
    attributes: [],
    children: items.map((item) => ({
      type: "mdxJsxFlowElement",
      name: "li",
      attributes: [],
      children: [
        genMdxLink(item.text, `#${slugify(item.text)}`),
        ...(item.children.length > 0
          ? ([renderTocTree(item.children)].filter(
              (node) => node !== null || node !== undefined,
            ) as MdxJsxFlowElement[])
          : []),
      ],
    })),
  };
};

// -----------------------
// -- Main
// -----------------------

export const injectTableOfContents = () => (tree: Root) => {
  const flatHeadings: { text: string; depth: number }[] = [];
  let firstHeadingIndex = -1;

  tree.children.forEach((node, index) => {
    if (node.type === "heading" && node.depth <= 3) {
      // To register a list of the headers
      if (firstHeadingIndex === -1) firstHeadingIndex = index;

      const text = node.children
        .filter((c): c is Text => c.type === "text")
        .map((c) => c.value)
        .join("");

      // [todo]
      const isPseudoMeta = /^(title|date|tags|author):/.test(text);

      if (text.trim() && !isPseudoMeta) {
        flatHeadings.push({ text, depth: node.depth });
      }
    }
  });

  if (flatHeadings.length === 0) return;

  const tocTree = buildTocTree(flatHeadings);
  const ulElement = renderTocTree(tocTree);

  if (!ulElement || ulElement === undefined) return;

  ulElement.attributes.push({
    type: "mdxJsxAttribute",
    name: "className",
    value: "table-of-contents",
  });

  const navElement: RootContent = {
    type: "mdxJsxFlowElement",
    name: "nav",
    attributes: [{ type: "mdxJsxAttribute", name: "className", value: "auto-navigate" }],
    children: [ulElement],
  } as RootContent;

  // Add a header list components
  const insertIndex = firstHeadingIndex !== -1 ? firstHeadingIndex : 0;
  tree.children.splice(insertIndex, 0, navElement);
};
