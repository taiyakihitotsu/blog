import type { FC, ReactNode } from "react";
import { colors } from "@/common/color.js";
import { layout } from "@/engine/layout.js";

/** ================
      Internal
================== */

const PaddingStyle = {
  ...layout.roundedPadding,
} as const;

const RoundedStyle = {
  border: `1px solid ${colors.roundedBorder}`,
  borderRadius: "12px",
  overflow: "hidden",
} as const;

const titleStyle = {
  ...layout.roundedTitle,
  fontSize: "0.9rem",
  fontWeight: "bold",
  color: colors.title,
} as const;

const fieldStyle = {
  ...PaddingStyle,
  ...RoundedStyle,
  boxSizing: "border-box",
  overflowWrap: "anywhere",
  wordBreak: "normal",
  minWidth: 0,
} as const;

/** ================
      Main
================== */

interface RoundedContentProps {
  children: ReactNode;
  title: string;
}

const RoundedContent: FC<RoundedContentProps> = ({ title, children }) => {
  return (
    <fieldset className={"roundedContent"} id={`roundedContent-${title}`} style={fieldStyle}>
      {title.length > 0 && <legend style={titleStyle}>{title}</legend>}
      {children}
    </fieldset>
  );
};

export default RoundedContent;
