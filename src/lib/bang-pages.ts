import { type Bang, commonBangs } from "./common-bangs";

const PAGE_TAG = /^[a-z0-9._-]+$/;
const EXCLUDED_TAGS = new Set(["ddg"]);

const pageTags = new Set(
  commonBangs.map((bang) => bang.t).filter((tag) => PAGE_TAG.test(tag) && !EXCLUDED_TAGS.has(tag)),
);

export function isPageTag(tag: string): boolean {
  return pageTags.has(tag);
}

export const pageBangs: Bang[] = commonBangs.filter((bang) => isPageTag(bang.t));
