import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Component/Composable test configuration
 * Uses happy-dom environment for browser APIs (AbortController, EventSource, etc.)
 */
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["app/composables/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["app/composables/**/*.ts"],
      exclude: [
        "**/__tests__/**",
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/node_modules/**",
        "**/dist/**",
      ],
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./", import.meta.url)),
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
