const BANG_REGEX = /!(\S+)/i;
const BANG_REPLACEMENT_REGEX = /!\S+\s*/i;

export const DEFAULT_BANG_EVENT = "ryuu-bang-change";

export function getDefaultBang(): string {
  if (typeof localStorage === "undefined") return "ddg";
  return localStorage.getItem("ryuu-bang") ?? "ddg";
}

export function setDefaultBang(tag: string): void {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem("ryuu-bang", tag);
  window.dispatchEvent(new Event(DEFAULT_BANG_EVENT));
}

export function parseBangTag(query: string): string | undefined {
  return query.match(BANG_REGEX)?.[1]?.toLowerCase();
}

export function buildBangUrl(bang: { d: string; u: string }, query: string): string {
  const search = query.replace(BANG_REPLACEMENT_REGEX, "").trim();
  if (!search) return `https://${bang.d}`;

  return bang.u.replace("{{{s}}}", encodeURIComponent(search).replace(/%2F/g, "/"));
}
