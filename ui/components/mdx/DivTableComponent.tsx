import { tableParentGen } from "@root/shared/common.js";
import React, { type ComponentPropsWithoutRef, isValidElement, type ReactNode } from "react";
import { colors } from "@/common/color.js";
import { layout } from "@/engine/layout.js";
import { cleanQuote } from "@/lib/text/cleanQuote.js";

const mdxMetadataCommonStyle = {
  ...layout.mdxMetadataCommon,
  fontSize: "0.9rem",
  display: "flex",
  alignItems: "center",
} as const;

const mdxMetadataRawStyle = {
  color: colors.metadataRaw,
  ...mdxMetadataCommonStyle,
} as const;

const mdxMetadataLabelStyle = {
  backgroundColor: colors.metadataLabelBack,
  color: colors.metadataLabelText,
  fontWeight: "600",
  borderRight: `1px solid ${colors.metadataLabelBorder}`,
  ...layout.metadataLabel,
  ...mdxMetadataCommonStyle,
} as const;

const mdxNavChild = (isDate: boolean) =>
  ({
    display: "grid",
    gridTemplateColumns: "140px 1fr", // [todo] Should be validated in type-level as well.
    border: `1px solid ${colors.navChild}`,
    borderBottom: isDate ? `1px solid ${colors.navChild}` : "none",
    backgroundColor: colors.navBorder,
    width: "100%",
  }) as const;

export const DivTableComponent = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
  if (props.id !== tableParentGen("title") && props.id !== tableParentGen("date")) {
    return null;
  }

  const isDate = props.id.includes("date");

  const processedChildren = React.Children.map(children, (child) => {
    if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) return child;
    const { className } = child.props;

    if (className === "metadata-label") {
      return (
        <div style={mdxMetadataLabelStyle}>
          {/* Label text is replaced only for date types to improve clarity. */}
          {isDate ? "last update" : child.props.children}
        </div>
      );
    }

    // Render the metadata value with cleaned content.
    if (className === "metadata-row") {
      const rawChild = child.props.children;
      const replacedChild = typeof rawChild === "string" ? cleanQuote(rawChild) : rawChild;

      return <div style={mdxMetadataRawStyle}>{replacedChild}</div>;
    }

    return child;
  });

  return (
    <div {...props} style={{ ...mdxNavChild(isDate), boxSizing: "border-box" }}>
      {processedChildren}
    </div>
  );
};
