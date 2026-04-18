// biome-ignore-all lint: for test
import type { Paragraph, Root, Text } from "mdast";
import { describe, expect, it } from "vitest";
import { removeFrontMatter } from "../../../pipeline/mdx/front-matter.js";
import type { MdxJsxFlowElement } from "../../../shared/mdx.js";

describe("removeFrontMatter", () => {
  it("Convert metadata to MDX JSX elements", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: "title:Hello World\ndate:2026-03-31",
            } as Text,
          ],
        } as Paragraph,
        {
          type: "paragraph",
          children: [{ type: "text", value: "普通のテキスト" } as Text],
        } as Paragraph,
      ],
    };

    const transformer = removeFrontMatter();
    transformer(tree);

    // export + title + date + general paragraph
    expect(tree.children.length).toBe(4);

    const [exportC, titleTableC, dateC, paragraphC] = tree.children;

    // ---------------------
    // -- Table Check
    // ---------------------
    const titleTable = titleTableC as unknown as MdxJsxFlowElement;

    expect(titleTable.type).toBe("mdxJsxFlowElement");
    expect(titleTable.name).toBe("div-table");

    const titleLabel = titleTable.children[0] as MdxJsxFlowElement;
    expect((titleLabel.children[0] as Text).value).toBe("title");
    expect(titleLabel.attributes[0]?.value).toBe("metadata-label");

    const titleValue = titleTable.children[1] as MdxJsxFlowElement;
    expect((titleValue.children[0] as Text).value).toBe("Hello World");
    expect(titleValue.attributes[0]?.value).toBe("metadata-row");

    // ---------------------
    // -- Date Check
    // ---------------------
    const dateTable = dateC as unknown as MdxJsxFlowElement;
    const dateLabel = dateTable.children[0] as MdxJsxFlowElement;
    expect((dateLabel.children[0] as Text).value).toBe("date");

    const dateValue = dateTable.children[1] as MdxJsxFlowElement;
    expect((dateValue.children[0] as Text).value).toBe("2026-03-31");
  });

  it("Keep not metadata", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Not a metadata: line" } as Text],
        } as Paragraph,
      ],
    };

    const transformer = removeFrontMatter();
    transformer(tree);

    expect(tree.children.length).toBe(1);
    expect(tree.children[0]?.type).toBe("paragraph");
  });
});
