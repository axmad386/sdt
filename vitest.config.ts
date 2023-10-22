import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["./test/**/*.test.ts"],
    server: {
      deps: {
        inline: [
          "@lunoxjs/core",
          "@lunoxjs/session",
          "@lunoxjs/zod",
          "@lunoxjs/typeorm",
        ],
      },
    },
    reporters: "verbose",
  },
});
