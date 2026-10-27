import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Plugin } from "vite";
import { pageBangs } from "../lib/bang-pages";
import { type Bang, commonBangs } from "../lib/common-bangs";

const ORIGIN = "https://search.ryuu.gg";
const PAGE_TITLE = "Bang Directory · Ryuu's Search";
const PAGE_DESCRIPTION = "Search any engine, instantly.";
const RELATED_LIMIT = 5;

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

function sameSite(a: string, b: string): boolean {
  const x = a.replace(/^www\./, "");
  const y = b.replace(/^www\./, "");
  return x === y || x.endsWith(`.${y}`) || y.endsWith(`.${x}`);
}

function relatedBangs(bang: Bang, index: number): Bang[] {
  return pageBangs
    .map((other, i) => ({ other, distance: Math.abs(i - index), site: sameSite(other.d, bang.d) }))
    .filter(({ distance }) => distance > 0)
    .sort((x, y) => Number(y.site) - Number(x.site) || x.distance - y.distance)
    .slice(0, RELATED_LIMIT)
    .map(({ other }) => other);
}

const crossInset = {
  tl: "top:calc(var(--cross-half-size) * -1);left:calc(var(--cross-half-size) * -1)",
  tr: "top:calc(var(--cross-half-size) * -1);right:calc(var(--cross-size) / 2)",
  bl: "bottom:calc(var(--cross-size) / 2);left:calc(var(--cross-half-size) * -1)",
  br: "bottom:calc(var(--cross-size) / 2);right:calc(var(--cross-size) / 2)",
};

const crosses = Object.values(crossInset)
  .map(
    (inset) =>
      `<div class="grid-cross" style="inset:auto;${inset}" aria-hidden="true"><div class="grid-crossline" style="width:var(--cross-half-size);height:var(--cross-size);border-right-width:1px"></div><div class="grid-crossline" style="width:var(--cross-size);height:var(--cross-half-size);border-bottom-width:1px"></div></div>`,
  )
  .join("");

function renderBangPage(bang: Bang, related: Bang[], shellHead: string): string {
  const rawName = bang.n ?? bang.t;

  const name = escapeHtml(rawName);
  const tag = escapeHtml(bang.t);
  const domain = escapeHtml(bang.d);

  const title = `${name} Bang (!${tag}) · Ryuu's Search`;
  const description = `!${tag} is the ${name} bang. Start a search with !${tag} to jump straight to ${name} results on ${domain}.`;

  const relatedRows = related
    .map((other) => {
      const otherName = escapeHtml(other.n ?? other.t);
      const otherTag = escapeHtml(other.t);
      return `<li><a href="/bangs/${otherTag}" class="border-border/60 hover:bg-accent/40 flex h-12 items-center gap-3 border-b px-3 last:border-b-0 sm:px-4"><span class="text-foreground min-w-0 flex-1 truncate text-sm font-medium">${otherName}</span><code class="text-muted-foreground shrink-0 font-mono text-xs">!${otherTag}</code></a></li>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${ORIGIN}/bangs/${tag}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
${shellHead}
</head>
<body>
<div class="flex min-h-svh flex-col">
  <header class="border-border text-muted-foreground bg-background flex h-12 shrink-0 items-center justify-between border-b px-4 font-mono text-xs tracking-[0.12em] uppercase">
    <a href="/bangs" class="hover:text-foreground transition-colors">All bangs</a>
    <a href="/" class="hover:text-foreground transition-colors">Ryuu's Search</a>
  </header>
  <main class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8 sm:py-12">
    <section class="flex flex-col items-center gap-3 text-center">
      <span class="text-muted-foreground font-mono text-xs tracking-[0.12em] uppercase">Bang · !${tag}</span>
      <h1 class="text-foreground text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">${name}</h1>
      <a href="https://${domain}" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground font-mono text-xs">${domain}</a>
      <p class="text-muted-foreground max-w-md text-sm">Start any search with <code class="text-foreground font-mono">!${tag}</code> and Ryuu's Search sends you straight to ${name} results, no extra page in between.</p>
    </section>
    <form action="/search" method="get" role="search" class="relative w-full">
      ${crosses}
      <div class="border-border bg-accent/20 dark:bg-input/20 flex h-14 items-stretch border">
        <input type="search" name="q" value="!${tag} " aria-label="Search ${name}" autocapitalize="none" autocomplete="off" spellcheck="false" class="text-foreground h-full min-w-0 flex-1 bg-transparent px-4 text-base outline-none" />
        <button type="submit" class="border-border text-muted-foreground hover:text-foreground border-l px-4 font-mono text-xs tracking-[0.12em] uppercase">Search</button>
      </div>
    </form>
    <section class="flex flex-col gap-3">
      <h2 class="text-muted-foreground font-mono text-xs tracking-[0.12em] uppercase">Related bangs</h2>
      <ul class="border-border border">${relatedRows}</ul>
    </section>
  </main>
</div>
</body>
</html>
`;
}

function sitemapEntries(): string {
  return pageBangs
    .map((bang) => `  <url><loc>${ORIGIN}/bangs/${escapeHtml(bang.t)}</loc></url>\n`)
    .join("");
}

function pickShellHead(html: string): string {
  const stylesheets = html.match(/<link\s+rel="stylesheet"[^>]*>/g);
  const themeScript = html.match(/<script>(?:(?!<\/script>)[\s\S])*?ryuu-theme[\s\S]*?<\/script>/);
  if (!stylesheets || !themeScript)
    throw new Error(
      "prerender-bangs: stylesheet or theme script not found in index.html; the shell drifted.",
    );

  return [themeScript[0], ...stylesheets].join("\n");
}

function replaceOnce(
  html: string,
  pattern: string | RegExp,
  replacement: string,
  what: string,
): string {
  const found = typeof pattern === "string" ? html.includes(pattern) : pattern.test(html);
  if (!found)
    throw new Error(`prerender-bangs: "${what}" not found in index.html; the shell drifted.`);

  return html.replace(pattern, replacement);
}

export function prerenderBangs(): Plugin {
  let dist = "dist";
  let publicDir = "public";

  return {
    name: "prerender-bangs",
    apply: "build",
    configResolved(config) {
      dist = resolve(config.root, config.build.outDir);
      publicDir = config.publicDir;
    },
    async writeBundle(_options, bundle) {
      const indexAsset = bundle["index.html"];
      if (indexAsset?.type !== "asset") return;

      let html =
        typeof indexAsset.source === "string"
          ? indexAsset.source
          : Buffer.from(indexAsset.source).toString("utf8");

      const shellHead = pickShellHead(html);

      html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${PAGE_TITLE}</title>`, "<title>");
      html = replaceOnce(
        html,
        /<meta\s+name="description"[^>]*>/,
        `<meta name="description" content="${PAGE_DESCRIPTION}" />`,
        "<meta name=description>",
      );

      html = replaceOnce(
        html,
        "</head>",
        `<link rel="canonical" href="${ORIGIN}/bangs" /></head>`,
        "</head>",
      );

      html = replaceOnce(
        html,
        /<div id="?root"?>\s*<\/div>/,
        `<div id="root">${renderRoot()}</div>`,
        "<div id=root>",
      );

      await mkdir(join(dist, "bangs"), { recursive: true });
      await writeFile(join(dist, "bangs", "index.html"), html);

      await Promise.all(
        pageBangs.map(async (bang, index) => {
          const dir = join(dist, "bangs", bang.t);
          await mkdir(dir, { recursive: true });
          await writeFile(
            join(dir, "index.html"),
            renderBangPage(bang, relatedBangs(bang, index), shellHead),
          );
        }),
      );

      const sitemap = await readFile(join(publicDir, "sitemap.xml"), "utf8");
      await writeFile(
        join(dist, "sitemap.xml"),
        replaceOnce(sitemap, "</urlset>", `${sitemapEntries()}</urlset>`, "</urlset>"),
      );
    },
  };
}
