import type { ComponentType, FC } from "react";
import type { MDXProps } from "@/../shared/mdx.js";
import GithubMarkdown from "@/components/mdx/GithubMarkdown.js";
import { mdxComponents } from "@/components/mdx/MdxComponents.js";
import CenterContent from "@/components/UI/CenterContent.js";
import RoundedContent from "@/components/UI/RoundedContent.js";

const docModules = import.meta.glob("../../../content/typescript/docs/*.md", { eager: true });

type DocViewerProps = {
  docId: string;
};

const DocViewer: FC<DocViewerProps> = ({ docId }) => {
  const path = `../../../content/typescript/docs/${docId}.md`;

  const mod = docModules[path] as { default: ComponentType<MDXProps> };
  const Content = mod?.default || null;

  return (
    <CenterContent>
      <RoundedContent title={`${docId}`}>
        <GithubMarkdown>
          <article className="markdown-body">
            {Content ? <Content components={mdxComponents} /> : <p>Loading or Not Found...</p>}
          </article>
        </GithubMarkdown>
      </RoundedContent>
    </CenterContent>
  );
};

export default DocViewer;
