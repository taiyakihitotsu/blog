import type { Paragraph, Root, RootContent, Text } from "mdast";
import { metadataProps, tableParent, tableParentGen } from "../../shared/common.js";
import type { EsObjectExpression, MdxJsxFlowElement, MdxjsEsm } from "../../shared/mdx.js";
import { parseMetadataToRecord } from "./parseMetadataToRecord.js";

const getMeta = (node: Paragraph): string => (node.children?.[0] as Text)?.value || "";

const metaChecker = (node: RootContent): node is Paragraph => {
  const firstChild = (node as Paragraph).children?.[0] as Text;
  return firstChild?.type === "text" && /^([a-zA-Z]+):/.test(firstChild.value || "");
};

const internalGenMdx = (name: string, value: string): MdxJsxFlowElement => {
  // Wraps the value in a specialized metadata component.
  return {
    type: "mdxJsxFlowElement",
    name: name,
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "className",
        value:
          (metadataProps as readonly string[]).indexOf(value) === -1
            ? "metadata-row"
            : `metadata-label`,
      },
    ],
    children: [{ type: "text", value: value }],
  };
};

const genMdxProps = (name: string, value: string): MdxJsxFlowElement => {
  const [label, content] = value.split(/([a-z]+):(.+)/).filter((s: string) => s !== "");

  return {
    type: "mdxJsxFlowElement",
    name: `${name}-table`,
    attributes: [
      { type: "mdxJsxAttribute", name: "className", value: tableParent },
      { type: "mdxJsxAttribute", name: "id", value: (label && tableParentGen(label)) ?? "" },
    ],
    children: [internalGenMdx(name, label ?? ""), internalGenMdx(name, content ?? "")],
  };
};

const toObjectExpression = (data: Record<string, string>): EsObjectExpression => ({
  type: "ObjectExpression" as const,
  properties: Object.entries(data).map(([key, value]) => ({
    type: "Property" as const,
    method: false,
    shorthand: false,
    computed: false,
    key: { type: "Identifier" as const, name: key },
    value: { type: "Literal" as const, value: value },
    kind: "init" as const,
  })),
});

const genMdxExport = (data: Record<string, string>): MdxjsEsm => ({
  type: "mdxjsEsm",
  value: `export const frontmatter = ${JSON.stringify(data)};`,
  data: {
    estree: {
      type: "Program",
      sourceType: "module",
      body: [
        {
          type: "ExportNamedDeclaration",
          declaration: {
            type: "VariableDeclaration",
            kind: "const",
            declarations: [
              {
                type: "VariableDeclarator",
                id: { type: "Identifier", name: "frontmatter" },
                init: toObjectExpression(data),
              },
            ],
          },
          specifiers: [] as const,
        },
      ],
    },
  },
});

// -----------------------
// -- Main
// -----------------------

type RemarkPlugin = () => (tree: Root) => void;

export const removeFrontMatter: RemarkPlugin = () => {
  return (tree: Root) => {
    let extractedData: Record<string, string> = {};

    tree.children = tree.children.flatMap((node: RootContent): RootContent[] => {
      // Remove two thematicBreak `---`, wrapping front matter.
      if (node.type === "thematicBreak") {
        return [];
      }

      if (metaChecker(node)) {
        const rawMeta = getMeta(node);
        extractedData = { ...extractedData, ...parseMetadataToRecord(rawMeta) };

        return getMeta(node)
          .split(/\n/)
          .filter((s: string) => s !== "")
          .map((n: string) => genMdxProps("div", n)) as RootContent[];
      }
      return [node];
    });

    if (Object.keys(extractedData).length > 0) {
      (tree.children as (RootContent | MdxjsEsm)[]).unshift(genMdxExport(extractedData));
    }
  };
};
