import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Plugin } from "vite";
import { commonBangs } from "../lib/common-bangs";

const ORIGIN = "https://search.ryuu.gg";
const PAGE_TITLE = "Bang Directory — Ryuu's Search";
const PAGE_DESCRIPTION = "Search any engine, instantly.";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderRoot(): string {
  const rows = commonBangs
    .map((bang) => {
      const rawName = bang.n ?? bang.t;

      const name = escapeHtml(rawName);
      const initial = escapeHtml(rawName.charAt(0).toUpperCase());

      const tag = escapeHtml(bang.t);
      const domain = escapeHtml(bang.d);

      const query = encodeURIComponent(`!${bang.t}`);

      return `<li class="border-border/60 flex h-16 items-center gap-3 border-b px-3 sm:px-4">
  <span class="border-border/60 text-muted-foreground flex size-8 shrink-0 items-center justify-center border font-mono text-xs font-semibold">${initial}</span>
  <div class="flex min-w-0 flex-1 flex-col">
    <span class="text-foreground truncate text-sm font-medium">${name}</span>
    <a href="https://${domain}" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground w-fit max-w-full truncate text-xs">${domain}</a>
  </div>
  <code class="text-muted-foreground shrink-0 font-mono text-xs">!${tag}</code>
  <a href="/search?q=${query}" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground shrink-0 font-mono text-xs uppercase tracking-[0.12em]" aria-label="Go to ${name}">Go</a>
</li>`;
    })
    .join("\n");

  return `<div class="flex min-h-svh flex-col">
  <main class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 pt-8 sm:pt-12">
    <header class="flex shrink-0 flex-col items-center gap-5">
      <h1 class="text-foreground text-center text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Bang Directory</h1>
      <p class="text-muted-foreground max-w-md text-center text-sm">Type a bang to jump straight to any search engine or site. ${commonBangs.length} popular shortcuts below; thousands more are searchable in the app.</p>
    </header>
    <ul class="border-border border">
${rows}
    </ul>
  </main>
</div>`;
}

export function prerenderBangs(): Plugin {
  let dist = "dist";

  return {
    name: "prerender-bangs",
    apply: "build",
    configResolved(config) {
      dist = resolve(config.root, config.build.outDir);
    },
    async writeBundle() {
      const shell = await readFile(join(dist, "index.html"), "utf8");

      const html = shell
        .replace(/<title>[^<]*<\/title>/, `<title>${PAGE_TITLE}</title>`)
        .replace(
          /<meta\s+name="description"[^>]*>/,
          `<meta name="description" content="${PAGE_DESCRIPTION}" />`,
        )
        .replace("</head>", `<link rel="canonical" href="${ORIGIN}/bangs" /></head>`)
        .replace(/<div id="?root"?>\s*<\/div>/, `<div id="root">${renderRoot()}</div>`);

      await mkdir(join(dist, "bangs"), { recursive: true });
      await writeFile(join(dist, "bangs", "index.html"), html);
    },
  };
}
