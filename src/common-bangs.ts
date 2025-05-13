// @see https://duckduckgo.com/bang.js

export interface Bang {
  d: string; // Domain
  u: string; // URL Template
  t: string; // Tag/Shortcut
}

export const commonBangs: Bang[] = [
  {
    d: "duckduckgo.com",
    u: "http://duckduckgo.com/?q={{{s}}}",
    t: "ddg",
  },
  {
    d: "www.google.com",
    u: "https://www.google.com/search?q={{{s}}}",
    t: "g",
  },
  {
    d: "www.youtube.com",
    u: "https://www.youtube.com/results?search_query={{{s}}}",
    t: "yt",
  },
  {
    d: "en.wikipedia.org",
    u: "https://en.wikipedia.org/wiki/Special:Search?search={{{s}}}",
    t: "w",
  },
  {
    d: "github.com",
    u: "https://github.com/search?utf8=%E2%9C%93&q={{{s}}}",
    t: "gh",
  },
];
