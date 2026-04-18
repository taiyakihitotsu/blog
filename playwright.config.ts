import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  use: {
    baseURL: "http://localhost:4173",
    browserName: "chromium",
  },

  projects: [
    {
      name: "functional",
      testIgnore: /.*lighthouse\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "lighthouse",
      testMatch: /.*lighthouse\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--remote-debugging-port=9222"],
        },
      },
      fullyParallel: false,
      workers: 1,
    },
  ],

  webServer: {
    command: "pnpm preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
