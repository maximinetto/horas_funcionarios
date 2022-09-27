import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    browser: false,
    include: ["**/tests/**/*.test.ts"],
    exclude: ["**/tests/**/*.integration.test.ts"],
    root: ".",
    clearMocks: true,
    setupFiles: "./src/setupTestEnvironment.ts",
    threads: false,
  },
});
