import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { type FC, Suspense, useRef } from "react";
import { loadingDotAnimation } from "@/animation/timeline.js";
import { colors } from "@/common/color.js";
import GitHubMyIcon from "@/components/icon/GitHubMyIcon.js";
import GitHubOfficialIcon from "@/components/icon/GitHubOfficialIcon.js";
import { layout } from "@/engine/layout.js";

const LoadingDots: FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".dot", loadingDotAnimation[0].animation);
    },
    { scope: container },
  );

  return (
    <div ref={container} style={{ display: "flex", gap: "8px" }}>
      <div className="dot" style={dotStyle} />
      <div className="dot" style={dotStyle} />
      <div className="dot" style={dotStyle} />
    </div>
  );
};

const dotStyle = {
  ...layout.dot,
  backgroundColor: colors.dot,
  borderRadius: "50%",
} as const;

const HeaderIcons: FC = () => {
  return (
    <div style={headerStyle}>
      <Suspense fallback={<LoadingDots />}>
        <GitHubMyIcon />
        <GitHubOfficialIcon />
      </Suspense>
    </div>
  );
};

const headerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  ...layout.header,
} as const;

const Header: FC = () => {
  return <HeaderIcons />;
};

export default Header;
