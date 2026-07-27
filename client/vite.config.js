import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("react/") ||
            id.includes("react-dom/")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("react-router-dom") ||
            id.includes("@tanstack/react-query")
          ) {
            return "routing-query-vendor";
          }

          if (
            id.includes("leaflet") ||
            id.includes("react-leaflet")
          ) {
            return "maps-vendor";
          }

          if (id.includes("recharts")) {
            return "charts-vendor";
          }

          if (
            id.includes("swiper") ||
            id.includes("embla-carousel")
          ) {
            return "carousel-vendor";
          }

          if (
            id.includes("@tiptap") ||
            id.includes("prosemirror")
          ) {
            return "editor-vendor";
          }

          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("zod")
          ) {
            return "form-vendor";
          }

          if (
            id.includes("lucide-react") ||
            id.includes("react-icons") ||
            id.includes("react-hot-toast")
          ) {
            return "ui-vendor";
          }

          if (id.includes("axios")) {
            return "http-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
