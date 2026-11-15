import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true, // Automatically clean outdated caches when a new service worker is activated
        // Optionally, you can also configure other caching strategies as needed
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
  optimizeDeps: {
    exclude: ["chunk-WG32MSTN.js"],
    // include: ["cropperjs"],
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@src": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
