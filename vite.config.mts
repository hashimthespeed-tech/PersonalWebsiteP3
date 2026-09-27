import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  build: {
    outDir: resolve(projectRoot, "assets/media-gallery"),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(projectRoot, "src/media-gallery-entry.tsx"),
      name: "MediaGallery",
      formats: ["iife"],
      fileName: () => "media-gallery.js",
      cssFileName: "media-gallery",
    },
  },
});