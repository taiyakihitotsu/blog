export const docDir = "content/typescript/docs";
export const docPageAddress = "/docs/";

export const genTitle = (title: string) => `${title}`;

export const tableParent = `front-matter-table-parent`;
export const tableParentGen = (s: string) => `$front-matter-table-parent-${s}`;

export const metadataProps = ["title", "date", "tags", "author", "description"] as const;
export type MetadataLabel = (typeof metadataProps)[number];
