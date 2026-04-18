import { type FC, useMemo } from "react";
import { colors } from "@/common/color.js";
import { layout } from "@/engine/layout.js";

/** ===============
      Internal
================= */

interface ArticleProps {
  id: string;
}

const NoArticle: FC = () => <p style={{ color: colors.noArticle }}>No articles found.</p>;

const getDocModules = (topic: "typescript" | "clojure") =>
  // https://vite.dev/guide/features#glob-import-caveats
  topic === "typescript"
    ? import.meta.glob(`@/../content/typescript/docs/*.md`)
    : import.meta.glob(`@/../content/clojure/docs/*.md`);

// [todo] lib
const getFileName = (path: string | undefined): string | undefined =>
  typeof path === "string" ? path.split("/").pop()?.replace(/\.md$/, "") : undefined;

const getArticleIdRecord = (path: string): ArticleProps | null => {
  const fileName = getFileName(path);

  if (!fileName) return null;

  return { id: fileName };
};

const ulStyle = {
  listStyle: "none",
  textAlign: "left",
} as const;

const docLinkStyle = {
  color: colors.articleFont,
  textDecoration: "none",
  fontSize: "1.1rem",
  display: "flex",
  alignItems: "center",
  gap: "8px",
} as const;

const DocLink: FC<ArticleProps> = (article) => (
  <a href={`/docs/${article.id}`} style={docLinkStyle}>
    <span style={{ fontWeight: 500 }}>{article.id}</span>
  </a>
);

/** ================
      Main
================== */

// [todo] lib
interface ArticleListProps {
  topic: "typescript" | "clojure";
}

const ArticleList: FC<ArticleListProps> = ({ topic = "typescript" }) => {
  const docModules = getDocModules(topic);

  const articles = useMemo(() => {
    return Object.keys(docModules)
      .map(getArticleIdRecord)
      .filter((article): article is ArticleProps => article !== null);
  }, [docModules]);

  if (articles.length === 0) {
    return <NoArticle />;
  }

  return (
    <nav aria-label="Article list">
      <ul style={ulStyle}>
        {articles.map((article) => (
          <li key={article.id} style={layout.articleLi}>
            <DocLink id={article.id} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ArticleList;
