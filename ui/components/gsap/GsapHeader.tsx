import type React from "react";
import { useRef } from "react";
import { headerAnimation } from "@/animation/timeline.js";
import { useScrollGsap } from "@/components/gsap/useScrollGsap.js";

const headerTags = "h1, h2, h3";

export const GsapHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const container = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  useScrollGsap({ container, animation: headerAnimation, titleTags: headerTags });

  return (
    <div ref={container} className="gsap-h2-scope">
      {children}
    </div>
  );
};

export default GsapHeader;
