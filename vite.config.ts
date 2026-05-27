import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import { defineConfig } from "vite";
import { VitePWA as pwa } from "vite-plugin-pwa";
import { instantRedirect } from "~/plugins/instant-redirect";
import { remarkGenerateToC } from "~/plugins/remark-generate-toc";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  build: { chunkSizeWarningLimit: 2000 },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),

    react(),
    tailwindcss(),

    mdx({ remarkPlugins: [remarkDirective, remarkDirectiveRehype, remarkGenerateToC] }),

    instantRedirect(),

    pwa({
      registerType: "autoUpdate",
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,svg,png,ico,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: /\/bangs\/.+\.json$/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "bang-shards" },
          },
        ],
      },
    }),
  ],
});
