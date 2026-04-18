import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import type { GsapProps } from "@/animation/timeline.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type UseScrollGsapProps = {
  container: RefObject<HTMLDivElement>;
  titleTags: string;
  animation: GsapProps[];
};

type UseScrollGsapFn = (props: UseScrollGsapProps) => void;

export const useScrollGsap: UseScrollGsapFn = ({ container, titleTags, animation }) => {
  // If a hash is present in the URL, the browser automatically jumps to the target element.
  // We defer the initialization of GSAP animations until this jump is complete.
  // This prevents animations from triggering prematurely at scrollY: 0 before the jump occurs.
  //
  // If no hash exists, window.scrollY should remain at 0.
  //
  // Apply initial GSAP states using gsap.set.
  // This is separated from the timeline to prevent redundant transitions or
  // "flash of unstyled content" (FOUC), ensuring the initial layout
  // and the first GSAP frame are perfectly aligned to prevent FOIT/FOUC.
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(titleTags);

      if (animation.length > 0) gsap.set(targets, animation[0].animation);

      // The animation sequence should be triggered only once:
      // When elements enter the viewport from either direction (scrolling down or up).
      const startOrchestra = () => {
        targets.forEach((target) => {
          const tl = gsap.timeline({ paused: true });

          animation.slice(1).forEach((anime) => {
            tl.to(target, anime.animation);
          });

          ScrollTrigger.create({
            trigger: target,
            start: "top 95%",
            end: "bottom 5%",
            onToggle: (self) => {
              if (self.isActive && tl.progress() === 0) {
                tl.play();
                self.kill();
              }
            },
            onRefresh: (self) => {
              if (self.isActive && tl.progress() === 0) {
                tl.play();
                self.kill();
              }
            },
          });
        });
      };

      // If a hash exists, the browser forced a jump from the top to the anchor.
      // Phase 1: window.scrollY is 0 (immediately after load); animations are suppressed to avoid misplacement.
      // Phase 2: window.scrollY becomes > 0 (after the jump); animations are ready to be triggered.
      if (hash && window.scrollY === 0) {
        const triggerOnce = () => {
          if (window.scrollY !== 0) {
            startOrchestra();
            window.removeEventListener("scroll", triggerOnce);
          }
        };
        window.addEventListener("scroll", triggerOnce, { passive: true, once: true });
      } else {
        startOrchestra();
      }
    },

    {
      scope: container,
      // [note]
      // `hash` is intentionally excluded from `dependencies`.
      // This prevents GSAP animations from re-initializing when the user
      // navigates between different anchors within the same page.
      dependencies: [],
    },
  );
};
