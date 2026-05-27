import { useMemo } from "react";
import { type Shortcut, shortcuts } from "./shortcuts";

export interface BangToken {
  start: number;
  end: number;
  query: string;
}

export function findBangToken(value: string, caret: number): BangToken | null {
  let start = caret;
  while (start > 0 && !/\s/.test(value.charAt(start - 1))) start--;

  let end = caret;
  while (end < value.length && !/\s/.test(value.charAt(end))) end++;

  if (value.charAt(start) !== "!") return null;
  return { start, end, query: value.slice(start + 1, end).toLowerCase() };
}

export interface BangSuggestion {
  tag: string;
  name: string;
  icon: Shortcut["icon"];
}

const MAX_SUGGESTIONS = 8;

interface EngineTags {
  name: string;
  icon: Shortcut["icon"];
  tags: string[];
}

const engines: EngineTags[] = (() => {
  const byName = new Map<string, EngineTags>();
  for (const shortcut of shortcuts) {
    if (!shortcut.name) continue;

    const existing = byName.get(shortcut.name);
    if (existing) existing.tags.push(shortcut.tag);
    else
      byName.set(shortcut.name, { name: shortcut.name, icon: shortcut.icon, tags: [shortcut.tag] });
  }

  return [...byName.values()];
})();

function shortestTag(tags: string[]): string {
  return tags.reduce((a, b) => (b.length < a.length ? b : a));
}

export function rankBangSuggestions(query: string): BangSuggestion[] {
  const scored: { suggestion: BangSuggestion; rank: number }[] = [];

  for (const engine of engines) {
    let best: { tag: string; rank: number } | null = null;
    for (const tag of engine.tags) {
      const rank = tag === query ? 0 : tag.startsWith(query) ? 1 : -1;
      if (rank < 0) continue;

      if (!best || rank < best.rank || (rank === best.rank && tag.length < best.tag.length))
        best = { tag, rank };
    }

    if (!best && query.length > 0 && engine.name.toLowerCase().includes(query))
      best = { tag: shortestTag(engine.tags), rank: 2 };

    if (best)
      scored.push({
        suggestion: { tag: best.tag, name: engine.name, icon: engine.icon },
        rank: best.rank,
      });
  }

  scored.sort(
    (a, b) =>
      a.rank - b.rank ||
      a.suggestion.tag.length - b.suggestion.tag.length ||
      a.suggestion.name.localeCompare(b.suggestion.name),
  );

  return scored.slice(0, MAX_SUGGESTIONS).map((entry) => entry.suggestion);
}

export function useBangSuggestions(
  value: string,
  caret: number,
): { token: BangToken | null; suggestions: BangSuggestion[] } {
  return useMemo(() => {
    const token = findBangToken(value, caret);
    return { token, suggestions: token ? rankBangSuggestions(token.query) : [] };
  }, [value, caret]);
}
