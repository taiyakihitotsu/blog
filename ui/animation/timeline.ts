import { foxp } from "@taiyakihitotsu/foxp";
import { colors } from "@/common/color.js";
import { rgbaCheck, rgbaRegex } from "@/lib/color/validateRGBA.js";

export type GsapProps = {
  timecode?: string;
  animation: gsap.TweenVars;
};

export const loadingDotAnimation: GsapProps[] = [
  {
    animation: {
      y: -10,
      stagger: { each: 0.2, repeat: -1, yoyo: true },
      ease: "power1.inOut",
    },
  },
];

export const loadedIconAnimation: (index: number) => GsapProps[] = (index) => [
  { animation: { opacity: 0, scale: 0.8, y: 60 } },
  {
    animation: {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
      delay: 0.2 + index * 0.15,
    },
  },
];

export const headerAnimation: GsapProps[] = [
  { animation: { opacity: 0, duration: 0 } },
  {
    animation: {
      opacity: 0.4,
      duration: 0.6,
      color: colors.markdown.h2.start,
    },
  },
  {
    animation: {
      opacity: 1,
      color: colors.markdown.h2.end,
      duration: 0.2,
      ease: "power2.out",
    },
  },
];

export const popupAnimation: GsapProps[] = [
  {
    animation: {
      opacity: 0,
      color: colors.markdown.text.start,
      x: 40,
    },
  },
  {
    animation: {
      opacity: 1,
      color: colors.markdown.text.end,
      x: 0,
      duration: 0.8,
      ease: "back.out(1.5)",
    },
  },
];

export const modalContentAnimation: GsapProps[] = [
  {
    animation: {
      background: `radial-gradient(circle at 0% 0%, ${rgbaCheck(rgbaRegex, foxp.putPrim("rgba(255, 255, 255, 0.3)")).value} 0%, ${rgbaCheck(rgbaRegex, foxp.putPrim("rgba(255, 255, 255, 0.3)")).value} 100%)`,
      backdropFilter: "blur(0px)",
    },
  },
  {
    animation: {
      background: `radial-gradient(circle at 40% 40%, ${rgbaCheck(rgbaRegex, foxp.putPrim("rgba(6, 182, 212, 0.4)")).value} 0%, ${rgbaCheck(rgbaRegex, foxp.putPrim("rgba(255, 255, 255, 0.2)")).value} 100%)`,
      backdropFilter: "blur(1px)",
      duration: 1,
      ease: "sine.inOut",
    },
  },
  {
    animation: {
      background: `radial-gradient(circle at 60% 80%, ${rgbaCheck(rgbaRegex, foxp.putPrim("rgba(147, 51, 234, 0.3)")).value} 0%, ${rgbaCheck(rgbaRegex, foxp.putPrim("rgba(6, 182, 212, 0.1)")).value} 100%)`,
      backdropFilter: "blur(2px)",
      duration: 2,
      ease: "sine.out",
    },
    timecode: "-=0.5",
  },
];
