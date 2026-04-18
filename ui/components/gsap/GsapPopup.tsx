import { useRef } from "react";
import { popupAnimation } from "@/animation/timeline.js";
import { useScrollGsap } from "@/components/gsap/useScrollGsap.js";

const popupElements = "p, li, nav, pre";

interface GsapPopupWrapperProps {
  children: React.ReactNode;
}

const GsapPopupWrapper: React.FC<GsapPopupWrapperProps> = ({ children }) => {
  const container = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  useScrollGsap({ container, animation: popupAnimation, titleTags: popupElements });

  return (
    <div ref={container} style={{ width: "100%" }}>
      {children}
    </div>
  );
};

export default GsapPopupWrapper;
