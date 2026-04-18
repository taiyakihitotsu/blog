import type { FC, ReactNode } from "react";
import { githubMarkdown } from "@/engine/layout.js";

interface GithubMarkdownProps {
  children: ReactNode;
}

const GithubMarkdown: FC<GithubMarkdownProps> = ({ children }) => {
  return <div style={githubMarkdown}>{children}</div>;
};

export default GithubMarkdown;
