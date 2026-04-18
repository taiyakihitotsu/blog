import { resolve } from "node:path";

export const resolveConfig = {
  resolve: {
    alias: {
      "@": resolve(__dirname, "./ui"),
      "@root": resolve(__dirname, "."),
    },
  },
};
