import type { FC } from "react";
import { layout } from "@/engine/layout.js";

type MenuIconProps = {
  stroke?: string;
};

export const MenuIcon: FC<MenuIconProps> = (props?) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-labelledby="closeIconTitle"
    {...props}
    {...layout.menuIcon}
  >
    <title id="openIconTitle">open</title>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default MenuIcon;
