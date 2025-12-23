import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit test configuration for pure functions
 * Uses Node environment (no DOM) for better performance
 */
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "shared/utils/__tests__/**/*.test.ts",
      "server/services/__tests__/**/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["shared/utils/**/*.ts", "server/services/**/*.ts"],
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
