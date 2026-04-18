import type { FC } from "react";
import { layout } from "@/engine/layout.js";

export const UpIcon: FC = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-labelledby="upIconTitle"
    {...props}
    {...layout.upIcon}
  >
    <title id="upIconTitle">Scroll to top</title>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export default UpIcon;
