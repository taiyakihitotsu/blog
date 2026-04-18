import type { ComponentPropsWithoutRef, FC } from "react";
import { colors } from "@/common/color.js";
import { layout } from "@/engine/layout.js";

const quoteStyle = {
  borderLeft: `4px solid ${colors.quoteBorder}`,
  color: colors.quote,
  ...layout.quote,
} as const;

export const BlockQuoteComponent: FC<ComponentPropsWithoutRef<"blockquote">> = ({
  children,
  ...props
}) => {
  return (
    <blockquote {...props} style={{ ...quoteStyle, ...props.style }}>
      {children}
    </blockquote>
  );
};
