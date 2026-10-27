import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { isPageTag, pageBangs } from "../src/lib/bang-pages";

const ORIGIN = "https://search.ryuu.gg";
const DIST = "dist";
const PAGE_BYTE_LIMIT = 8 * 1024;

function check(condition: unknown, message: string): asserts condition {
  if (condition) return;
  console.error(`verify-bang-pages: ${message}`);
  process.exit(1);
}

function read(path: string): string {
  check(existsSync(path), `${path} is missing; run pnpm build first`);
  return readFileSync(path, "utf8");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function checkPages() {
  for (const tag of ["gh", "w"]) check(isPageTag(tag), `!${tag} is not a page tag`);

  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const bang of pageBangs) {
    const path = join(DIST, "bangs", bang.t, "index.html");
    const html = read(path);

    const tag = escapeHtml(bang.t);
    const name = escapeHtml(bang.n ?? bang.t);

    check(statSync(path).size < PAGE_BYTE_LIMIT, `${path} weighs ${statSync(path).size} bytes`);
    check(html.includes(`>${name}</h1>`), `${path} lacks the name ${name}`);
    check(html.includes(`!${tag}`), `${path} lacks !${tag}`);
    check(
      html.includes(`href="https://${escapeHtml(bang.d)}"`),
      `${path} lacks a link to ${bang.d}`,
    );
    check(
      /<form action="\/search" method="get"/.test(html) &&
        new RegExp(`<input[^>]*name="q"[^>]*value="!${escapeRegExp(tag)} "`).test(html),
      `${path} lacks a GET form to /search prefixed with !${tag}`,
    );

    check(
      html.includes(`<link rel="canonical" href="${ORIGIN}/bangs/${tag}" />`),
      `${path} lacks its canonical URL`,
    );

    check(
      !/<script[^>]*(\ssrc=|type="module")/.test(html) && !/rel="modulepreload"/.test(html),
      `${path} loads app JavaScript`,
    );

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
    check(title.includes(name) && !titles.has(title), `${path} lacks its own title`);
    check(
      description.includes(`!${tag}`) && !descriptions.has(description),
      `${path} lacks its own description`,
    );

    titles.add(title);
    descriptions.add(description);
  }

  for (const tag of ["ddg", "arch"])
    check(!existsSync(join(DIST, "bangs", tag)), `dist/bangs/${tag}/ exists`);
}

interface Rewrite {
  source: string;
  destination: string;
}

function sourcePattern(source: string): RegExp {
  const pattern = source
    .split(/(:[a-z]+|\(\.\*\))/i)
    .map((part) => {
      if (part === "(.*)") return "(.*)";
      if (part.startsWith(":")) return "([^/]+)";
      return escapeRegExp(part);
    })
    .join("");

  return new RegExp(`^${pattern}$`);
}

function resolveVercel(rewrites: Rewrite[], path: string): { file: string; via?: number } {
  if (existsSync(join(DIST, path)) && statSync(join(DIST, path)).isFile()) return { file: path };

  for (const [via, rewrite] of rewrites.entries()) {
    const match = path.match(sourcePattern(rewrite.source));
    if (!match) continue;

    const params = rewrite.source.match(/:[a-z]+/gi) ?? [];
    const file = params.reduce(
      (destination, param, i) => destination.replace(param, match[i + 1] ?? ""),
      rewrite.destination,
    );

    return { file, via };
  }

  return { file: path };
}

function checkRouting() {
  const { rewrites } = JSON.parse(read("vercel.json")) as { rewrites: Rewrite[] };
  const catchAll = rewrites.findIndex((rewrite) => rewrite.source === "/(.*)");
  check(catchAll >= 0, "vercel.json lost its SPA catch all");

  const page = resolveVercel(rewrites, "/bangs/gh");
  check(
    page.file === "/bangs/gh/index.html" && page.via !== undefined && page.via < catchAll,
    `vercel.json sends /bangs/gh to ${page.file}, not its page`,
  );

  check(existsSync(join(DIST, page.file)), `${page.file} does not exist`);

  for (const path of ["/bangs/a.json", "/bangs/index.json"]) {
    const file = resolveVercel(rewrites, path);
    check(file.file === path && file.via === undefined, `vercel.json shadows ${path}`);
  }

  const sw = read(join(DIST, "sw.js"));
  const denylist = sw.match(/NavigationRoute\([^)]*\)\s*,\s*\{denylist:\[(.+?)\]\}\)/)?.[1];
  check(denylist, "the service worker has no navigation denylist");

  const patterns = [...denylist.matchAll(/\/((?:\\.|\[[^\]]*\]|[^/\\[])+)\/([a-z]*)/g)].map(
    ([, body = "", flags]) => new RegExp(body, flags),
  );

  const denied = (path: string) => patterns.some((pattern) => pattern.test(path));
  const pagePaths = ["/bangs/gh", "/bangs/w", "/bangs/gh/", "/bangs/gh?ref=https://example.com/"];
  for (const path of [...pagePaths, "/bangs/gh/?utm_source=x"])
    check(denied(path), `the service worker serves ${path} the SPA`);

  for (const path of ["/", "/bangs", "/bangs?q=x", "/search?q=!gh"])
    check(!denied(path), `the service worker denies the SPA route ${path}`);

  check(!/url:"bangs\/[^/"]+\/index\.html"/.test(sw), "the service worker precaches bang pages");
}

function checkSitemap() {
  const sitemapUrl = URL.parse(read("public/robots.txt").match(/^Sitemap:\s*(\S+)$/m)?.[1] ?? "");
  check(sitemapUrl?.origin === ORIGIN, "public/robots.txt names no sitemap on the site origin");

  const locs = (path: string) => [...read(path).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const built = locs(join(DIST, sitemapUrl.pathname));
  const expected = [
    ...locs("public/sitemap.xml"),
    ...pageBangs.map((bang) => `${ORIGIN}/bangs/${bang.t}`),
  ];

  check(built.length === new Set(built).size, "the sitemap lists a URL twice");
  check(
    built.length === expected.length && expected.every((url) => built.includes(url)),
    `the sitemap lists ${built.length} URLs, expected ${expected.length}`,
  );
}

checkPages();
checkRouting();
checkSitemap();

console.log(`verify-bang-pages: ok, ${pageBangs.length} pages`);
