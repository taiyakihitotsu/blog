import type { RootContent, Text } from "mdast";
import type { ComponentType, ComponentPropsWithoutRef, ReactNode } from "react";

// ------------------------------
// -- For Es Export
// ------------------------------

interface EsIdentifier {
  type: "Identifier";
  name: string;
}

interface EsLiteral {
  type: "Literal";
  value: string;
}

interface EsProperty {
  type: "Property";
  method: false;
  shorthand: false;
  computed: false;
  key: EsIdentifier;
  value: EsLiteral;
  kind: "init";
}

interface EsObjectExpression {
  type: "ObjectExpression";
  properties: EsProperty[];
}

interface EsVariableDeclarator {
  type: "VariableDeclarator";
  id: EsIdentifier;
  init: EsObjectExpression;
}

interface EsVariableDeclaration {
  type: "VariableDeclaration";
  kind: "const";
  declarations: EsVariableDeclarator[];
}

interface EsExportNamedDeclaration {
  type: "ExportNamedDeclaration";
  declaration: EsVariableDeclaration;
  specifiers: readonly [];
}

export interface MdxjsEsm {
  type: "mdxjsEsm";
  value: string;
  data: {
    estree: {
      type: "Program";
      sourceType: "module";
      body: EsExportNamedDeclaration[];
    };
  };
}

// ------------------------------
// -- Front Matter Data Type
// ------------------------------

export interface MdxModule {
  frontmatter: Record<string, string>;
}

// ------------------------------
// -- For Frontend
// ------------------------------

type MdxJsxFlowElementContent = "mdxJsxFlowElement";

export interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value: string;
}

export interface MdxJsxFlowElement {
  type: RootContent | MdxJsxFlowElementContent;
  name: string | null;
  attributes: Array<MdxJsxAttribute>;
  children: (RootContent | MdxJsxFlowElement | Text)[];
}

// By default, mdast's `RootContent` union type does not include MDX-specific nodes.
// This resolves type errors in `removeFrontMatter` defined in `front-matter.ts`.
import "mdast";
declare module "mdast" {
  interface RootContentMap {
    mdxJsxFlowElement: MdxJsxFlowElement;
  }
}

// --------------------

export type MDXComponents = {
  [K in keyof JSX.IntrinsicElements]?: ComponentType<ComponentPropsWithoutRef<K>>;
} & {
  [key: string]: ComponentType<Record<string, unknown>> | undefined;
};

export interface MDXProps {
  components?: MDXComponents;
  children?: ReactNode;
}

declare global {
  declare module "*.mdx" {
    import type { ComponentType } from "react";
    const MDXComponent: ComponentType<MDXProps>;
    export default MDXComponent;
  }

  declare module "*.md" {
    import type { ComponentType } from "react";
    const MDXComponent: ComponentType<MDXProps>;
    export default MDXComponent;
  }
}
