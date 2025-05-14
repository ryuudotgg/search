import { defineConfig } from "vite";
import { VitePWA as pwa } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import { remarkGenerateToC } from "./src/plugins/remark-generate-toc";
import { TanStackRouterVite as tanstack } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstack({ target: "react", autoCodeSplitting: true }),

    react(),
    tailwindcss(),

    mdx({
      remarkPlugins: [
        remarkDirective,
        remarkDirectiveRehype,
        remarkGenerateToC,
      ],
    }),

    tsconfigPaths(),

    pwa({ registerType: "autoUpdate" }),
  ],
});
