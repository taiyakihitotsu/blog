import { foxp } from "@taiyakihitotsu/foxp";
import { rgbaCheck, rgbaRegex } from "@/lib/color/validateRGBA.js";

// --------------------
// -- General
// --------------------

const purple = "#a027d8";
const purple1 = "#b946b9";
const vividSkyblue = "#1ecbe1";
const articleBlack = "#57606a";
const nearWhite = "#f3f4f6";
const darkBlue = "#111827";
const white = "#ffffff";
const paleGray = "#374151";
const palePurpleGray = "#d5b2de";
const quoteGray = "#636c76";
const green = "#2cd34c";

// ---------------------
// -- Core
// ---------------------

export const colors = {
  articleFont: "#0969da",
  transparent: "rgba(0, 0, 0, 0)",
  roundedBorder: purple,
  title: purple1,
  markdown: {
    h2: { start: vividSkyblue, end: purple1 },
    text: { start: articleBlack, end: purple1 },
  },
  openIconBack: "white",
  contentBack: "white",
  closeIconBack: "white",
  modalBack: rgbaCheck(rgbaRegex, foxp.putPrim("rgba(255, 255, 255, 0.3)")).value,
  metadataLabelBack: nearWhite,
  metadataRaw: darkBlue,
  navChild: nearWhite,
  navBorder: white,
  preBack: nearWhite,
  openIconBorder: purple,
  openIconColor: purple,
  closeIconBorder: purple,
  closeIconColor: purple,
  headersContentsBorder: purple,
  metadataLabelText: paleGray,
  metadataLabelBorder: palePurpleGray,
  dot: purple1,
  profileText: purple1,
  quoteBorder: palePurpleGray,
  preBorder: purple,
  quote: quoteGray,
  noArticle: green,
} as const;

export type Color = (typeof colors)[keyof typeof colors];
