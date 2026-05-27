// @see https://duckduckgo.com/bang.js
// @note custom bangs first (they matter most), then the DDG table (already sorted by relevance).

import { customBangs } from "./custom-bangs";
import { ddgBangs } from "./ddg-bangs";

export interface Bang {
  c?: string; // Category
  d: string; // Domain
  r: number; // Relevance/Popularity
  s: string; // Site Name
  sc?: string; // Subcategory
  t: string; // Tag/Shortcut
  u: string; // URL Template
  a?: string[]; // Alias tags (merged duplicates)
}

export const bangs: Bang[] = [...customBangs, ...ddgBangs];
