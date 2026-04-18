import { foxp } from "@taiyakihitotsu/foxp";
import type { IsOverlapContent, IsSeparated } from "@/engine/collision.js";

// ------------------------------------------------------------
// [Maintenance Note]
// This file heavily relies on @taiyakihitotsu/foxp for static layout validation.
// As foxp is under active development, any breaking changes in its core engine will be immediately reflected here to ensure the integrity of our compile-time CSS safety.
// ------------------------------------------------------------

// ------------------------------------------------------------
// -- Adjacent menu buttons and its collision detection.
// ------------------------------------------------------------

export const openButtonLayout = {
  x: 10,
  y: 10,
  sizeX: 50,
  sizeY: 50,
} as const;

export const upButtonLayout = {
  x: 10,
  y: 70,
  sizeX: 50,
  sizeY: 50,
} as const;

const buttonLayouts = foxp.putVec([openButtonLayout, upButtonLayout] as const);

foxp.tid<IsSeparated>()(buttonLayouts);

// ---------------------------------------------
// -- Modal close button of header list.
// ---------------------------------------------

// [note]
// This is not tested currently.
// I'm unsure if collision detection is necessary for elements that are intentionally far apart, like this one.
export const closeButtonLayout = {
  x: 8,
  y: 8,
  sizeX: 50,
  sizeY: 50,
  pos: "right",
} as const;

// -----------------------------------------
// -- Convert layout to CSS style.
// -----------------------------------------

const childrenPadLayout = { x: 16, sizeX: 1000 } as const;
const roundedPadLayout = { x: 16, sizeX: 1000 } as const;
const markdownPadLayout = { x: 32, sizeX: 1000 } as const;

const paddingLayout = foxp.putVec([
  childrenPadLayout,
  roundedPadLayout,
  markdownPadLayout,
] as const);

foxp.tid<IsOverlapContent<(typeof buttonLayouts)["sexpr"], 0, (typeof paddingLayout)["sexpr"]>>()(
  foxp.putPrim(true),
);
foxp.tid<IsOverlapContent<(typeof buttonLayouts)["sexpr"], 1, (typeof paddingLayout)["sexpr"]>>()(
  foxp.putPrim(true),
);

// -----------------------------------------
// -- Convert layout to CSS style.
// -----------------------------------------

export type PxLayout<Pos extends "left" | "right" = "left"> = {
  [K in "top" | (Pos extends "left" ? "left" : "right") | "width" | "height"]: string;
};

export const generatePxLayout = <T extends "left" | "right" = "left">({
  x,
  y,
  sizeX,
  sizeY,
  pos = "left" as T,
}: {
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
  pos?: T;
}): PxLayout<T> =>
  ({
    top: `${y}px`,
    ...(pos === "left" ? { left: `${x}px` } : { right: `${x}px` }),
    width: `${sizeX}px`,
    height: `${sizeY}px`,
  }) as PxLayout<T>;

export const generatePadLayout = ({ x }: { x: number }) => ({
  padding: `clamp(${x}px, 5vw, ${Math.min(32, x * 2)}px)`,
});

// --------------------------------------
// -- Profile
//
// This is `style` part.
// ---------------------------------------

export const profileOuter = {
  width: "90%",
  maxWidth: "800px",
} as const;

const childrenWrapper = {
  ...generatePadLayout(childrenPadLayout),
} as const;

const roundedPadding = {
  maxWidth: "800px",
  width: "calc(100% - 32px)",
  margin: "20px auto",
  ...generatePadLayout(roundedPadLayout),
} as const;

export const githubMarkdown = {
  maxWidth: "800px",
  margin: "0 auto",
  ...generatePadLayout(markdownPadLayout),
} as const;

const metadataLabel = {} as const;

const dot = {
  width: "8px",
  height: "8px",
} as const;

const header = {
  minHeight: "160px",
} as const;

const close = {
  width: "24px",
  height: "24px",
} as const;

const myIcon = {
  width: "100px",
} as const;

const githubOfficialIcon = { width: "100px", height: "100px" } as const;

const upIcon = { width: "24px", height: "24px" } as const;
const menuIcon = upIcon;

const mdxMetadataCommon = {
  padding: "8px 16px",
} as const;

const mdxPre = {
  padding: "16px",
} as const;

const modal = {} as const;

const closeIcon = {
  padding: "12px",
} as const;

const contentList = {
  margin: "32px",
  padding: "2rem",
} as const;

const quote = {
  margin: "1.5em 0",
  padding: "0 1em",
} as const;

const video = { width: "100%", margin: "1rem 0" } as const;

const centerContent = {
  minHeight: "min-content",
  width: "100%",
} as const;

const centerOuter = {
  top: "0%",
  left: 0,
  width: "100%",
  height: "100%",
} as const;

const roundedTitle = {
  paddingRight: "8px",
  paddingLeft: "8px",
} as const;

const articleLi = { marginBottom: "12px" } as const;

// ---------------------------
// -- Core
// ---------------------------

export const layout = {
  dot,
  header,
  close,
  myIcon,
  githubOfficialIcon,
  upIcon,
  menuIcon,
  metadataLabel,
  roundedPadding,
  mdxMetadataCommon,
  mdxPre,
  modal,
  closeIcon,
  childrenWrapper,
  contentList,
  quote,
  video,
  centerOuter,
  centerContent,
  roundedTitle,
  articleLi,
} as const;
