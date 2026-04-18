import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["./test/**/*.{test,spec}.{ts,mts,cts,tsx,js,jsx}"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/playwright/**", "**/playwright-report/**"],
      globals: true,
      environment: "node",
    },
  }),
);
