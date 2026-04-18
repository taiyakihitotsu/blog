import type { CSSProperties, FC, ReactNode } from "react";
import { zIndex } from "@/common/z-index.js";
import { layout } from "@/engine/layout.js";

/** ==================
      Internal
=================== */

type ContentStyleProps = {
  paddingTop: string;
  paddingBottom: string;
};

type ContentStyleReturn = {
  width: string;
  display: string;
  flexDirection: CSSProperties["flexDirection"];
  alignItems: string;
  paddingTop: string;
  paddingBottom: string;
  minHeight: string;
};

type ContentStyleFn = (props: ContentStyleProps) => ContentStyleReturn;

const contentStyle: ContentStyleFn = ({ paddingTop = "0vh", paddingBottom = "10vh" }) => ({
  ...layout.centerContent,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: paddingTop,
  paddingBottom: paddingBottom,
});

const outerStyle: CSSProperties = {
  ...layout.centerOuter,
  overflowY: "auto",
  zIndex: zIndex.virtualScroll,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxSizing: "border-box",
};

const childrenWrapperStyle: CSSProperties = {
  width: "100%",
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  ...layout.childrenWrapper,
};

/** ==================
      Main
=================== */

interface CenterContainerProps {
  children: ReactNode;
  zIndex?: number;
  paddingTop?: string;
  paddingBottom?: string;
  topOffset?: string;
}

const CenterContainer: FC<CenterContainerProps> = ({
  children,
  paddingTop = "0vh",
  paddingBottom = "10vh",
}) => {
  return (
    <div style={outerStyle}>
      <div style={contentStyle({ paddingTop, paddingBottom })}>
        <div style={childrenWrapperStyle}>{children}</div>
      </div>
    </div>
  );
};

export default CenterContainer;
