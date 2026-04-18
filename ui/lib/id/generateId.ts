import type { ReactNode } from "react";

/**
Generate title to `id` to put it the object to jump.
*/
export const generateId = (children: ReactNode): string | undefined => {
  if (typeof children === "string") {
    return children.toLowerCase().replace(/\s+/g, "-");
  }
  return undefined;
};
