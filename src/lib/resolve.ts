import type { Bang } from "./common-bangs";

const BANG_REGEX = /!(\S+)/i;
const BANG_REPLACEMENT_REGEX = /!\S+\s*/i;

// The bang tag in a query (e.g. "!yt foo" -> "yt"), lowercased, or undefined.
export function parseBangTag(query: string): string | undefined {
  return query.match(BANG_REGEX)?.[1]?.toLowerCase();
}

// The destination URL for a bang, with the bang stripped from the query and the
// rest substituted into the template. Bare bangs (no query) go to the domain.
export function buildBangUrl(bang: Bang, query: string): string {
  const search = query.replace(BANG_REPLACEMENT_REGEX, "").trim();
  if (!search) return `https://${bang.d}`;
  return bang.u.replace("{{{s}}}", encodeURIComponent(search).replace(/%2F/g, "/"));
}
