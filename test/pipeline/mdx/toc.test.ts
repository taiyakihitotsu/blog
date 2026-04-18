// biome-ignore-all lint: for test
import type { Heading, Paragraph, Root, Text } from "mdast";
import { describe, expect, it } from "vitest";
import { injectTableOfContents } from "../../../pipeline/mdx/toc.js";
import type { MdxJsxFlowElement } from "../../../shared/mdx.js";

describe("injectTableOfContents", () => {
  it("generates a nested TOC (nav > ul > li > (a + ul)) from h1, h2, h3", () => {
    const tree: Root = {
      type: "root",
      children: [
        { type: "heading", depth: 1, children: [{ type: "text", value: "Title One" }] } as Heading,
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Section Two" }],
        } as Heading,
        {
          type: "heading",
          depth: 3,
          children: [{ type: "text", value: "Sub Section Three" }],
        } as Heading,
      ],
    };

    const transformer = injectTableOfContents();
    transformer(tree);

    const nav = tree.children[0] as MdxJsxFlowElement;
    expect(nav.name).toBe("nav");
    expect(nav.attributes.find((a) => a.name === "className")?.value).toBe("auto-navigate");

    const ul1 = nav.children[0] as MdxJsxFlowElement;
    expect(ul1.name).toBe("ul");
    expect(ul1.attributes.find((a) => a.name === "className")?.value).toBe("table-of-contents");

    const liH1 = ul1.children[0] as MdxJsxFlowElement;
    const linkH1 = liH1.children[0] as MdxJsxFlowElement;
    expect(linkH1.attributes[0]?.value).toBe("#title-one");

    const ul2 = liH1.children[1] as MdxJsxFlowElement;
    const liH2 = ul2.children[0] as MdxJsxFlowElement;
    const linkH2 = liH2.children[0] as MdxJsxFlowElement;
    expect(linkH2.attributes[0]?.value).toBe("#section-two");

    const ul3 = liH2.children[1] as MdxJsxFlowElement;
    const liH3 = ul3.children[0] as MdxJsxFlowElement;
    const linkH3 = liH3.children[0] as MdxJsxFlowElement;
    expect(linkH3.attributes[0]?.value).toBe("#sub-section-three");
  });

  it("places headings of the same depth as siblings", () => {
    const tree: Root = {
      type: "root",
      children: [
        { type: "heading", depth: 2, children: [{ type: "text", value: "A" }] } as Heading,
        { type: "heading", depth: 2, children: [{ type: "text", value: "B" }] } as Heading,
      ],
    };

    const transformer = injectTableOfContents();
    transformer(tree);

    const nav = tree.children[0] as MdxJsxFlowElement;
    const ul = nav.children[0] as MdxJsxFlowElement;

    expect(ul.children.length).toBe(2);
  });

  it("ignores headings deeper than h3", () => {
    const tree: Root = {
      type: "root",
      children: [
        { type: "heading", depth: 4, children: [{ type: "text", value: "Too Deep" }] } as Heading,
      ],
    };

    const transformer = injectTableOfContents();
    transformer(tree);

    expect(tree.children.length).toBe(1);
  });

  it("does nothing when no headings are present", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "No headings here" }],
        } as Paragraph,
      ],
    };

    const transformer = injectTableOfContents();
    transformer(tree);

    expect(tree.children.length).toBe(1);
  });

  it("extracts only text nodes inside headings", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 2,
          children: [
            { type: "text", value: "Bold " },
            { type: "strong", children: [{ type: "text", value: "Title" }] } as any,
          ],
        } as Heading,
      ],
    };

    const transformer = injectTableOfContents();
    transformer(tree);

    const nav = tree.children[0] as MdxJsxFlowElement;
    const ul = nav.children[0] as MdxJsxFlowElement;
    const a = (ul.children[0] as MdxJsxFlowElement).children[0] as MdxJsxFlowElement;

    expect((a.children[0] as Text).value).toBe("Bold ");
    expect(a.attributes[0]?.value).toBe("#bold-");
  });

  it("slugify handles special characters", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 1,
          children: [{ type: "text", value: "Hello! World @2026" }],
        } as Heading,
      ],
    };

    const transformer = injectTableOfContents();
    transformer(tree);

    const nav = tree.children[0] as MdxJsxFlowElement;
    const ul = nav.children[0] as MdxJsxFlowElement;
    const a = (ul.children[0] as MdxJsxFlowElement).children[0] as MdxJsxFlowElement;

    expect(a.attributes[0]?.value).toBe("#hello-world-2026");
  });

  it("does not include empty headings", () => {
    const tree: Root = {
      type: "root",
      children: [{ type: "heading", depth: 1, children: [{ type: "text", value: "" }] } as Heading],
    };

    const transformer = injectTableOfContents();
    transformer(tree);

    expect(tree.children.length).toBe(1);
  });
});
