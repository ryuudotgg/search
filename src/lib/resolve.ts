import type { Bang } from "./common-bangs";

const BANG_REGEX = /!(\S+)/i;
const BANG_REPLACEMENT_REGEX = /!\S+\s*/i;

export function getDefaultBang(): string {
  if (typeof localStorage === "undefined") return "ddg";
  return localStorage.getItem("ryuu-bang") ?? "ddg";
}

export function parseBangTag(query: string): string | undefined {
  return query.match(BANG_REGEX)?.[1]?.toLowerCase();
}

export function buildBangUrl(bang: Bang, query: string): string {
  const search = query.replace(BANG_REPLACEMENT_REGEX, "").trim();
  if (!search) return `https://${bang.d}`;

  return bang.u.replace("{{{s}}}", encodeURIComponent(search).replace(/%2F/g, "/"));
}
