import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    browser: false,
    include: ["**/tests/**/*.integration.test.ts"],
    root: ".",
    threads: false,
    maxThreads: 1,
    maxConcurrency: 1,
  },
});
