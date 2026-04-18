import type { FC } from "react";
import { layout } from "@/engine/layout.js";

export const CloseIcon: FC = (props) => (
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
    {...layout.close}
  >
    <title id="closeIconTitle">Close</title>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default CloseIcon;
