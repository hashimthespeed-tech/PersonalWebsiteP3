import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  build: {
    outDir: resolve(projectRoot, "assets/works-wheel"),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(projectRoot, "src/media-wheel-entry.tsx"),
      name: "MediaWorksWheel",
      formats: ["iife"],
      fileName: () => "media-works-wheel.js",
      cssFileName: "media-works-wheel",
    },
  },
});