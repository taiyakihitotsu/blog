import { type ComponentPropsWithoutRef, useCallback } from "react";
import { ModalHeaderList } from "@/components/mdx/ModalHeaderList.js";
import { generateId } from "@/lib/id/generateId.js";
import { useSceneStore } from "@/store/useSceneStore.js";

/** ================
      Main
================= */

// ----------------- NavComponent -----------------
//
// A specialized wrapper for the <nav> element used within MDX components.
//
// It automatically detects containers with the "auto-navigate" class
// to inject a modal-based navigation list generated from Markdown headings.
// -------------------------------------------------
export const NavComponent = (props: ComponentPropsWithoutRef<"nav">) => {
  const { isCurrentScene, setNextScene } = useSceneStore();

  const handleClose = useCallback(() => useSceneStore.getState().setNextScene("main")(), []);
  const handleOpen = useCallback(() => setNextScene<"main">("modal")(), [setNextScene]);

  if (props.className?.includes("auto-navigate")) {
    return (
      <ModalHeaderList
        isOpen={isCurrentScene("modal")}
        handleClose={handleClose}
        handleOpen={handleOpen}
      >
        <nav className={"navComponent"} {...props} id={generateId(props.children)}>
          {props.children}
        </nav>
      </ModalHeaderList>
    );
  }

  return <nav {...props}>{props.children}</nav>;
};
