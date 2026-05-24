// @see https://duckduckgo.com/bang.js

export interface Bang {
  n?: string; // Display Name
  d: string; // Domain
  u: string; // URL Template
  t: string; // Tag/Shortcut
}

export const commonBangs: Bang[] = [
  {
    n: "DuckDuckGo",
    d: "duckduckgo.com",
    u: "https://duckduckgo.com/?q={{{s}}}",
    t: "ddg",
  },
  {
    n: "Google",
    d: "www.google.com",
    u: "https://www.google.com/search?q={{{s}}}",
    t: "g",
  },
  {
    n: "YouTube",
    d: "www.youtube.com",
    u: "https://www.youtube.com/results?search_query={{{s}}}",
    t: "yt",
  },
  {
    n: "Wikipedia",
    d: "en.wikipedia.org",
    u: "https://en.wikipedia.org/wiki/Special:Search?search={{{s}}}",
    t: "w",
  },
  {
    n: "GitHub",
    d: "github.com",
    u: "https://github.com/search?utf8=%E2%9C%93&q={{{s}}}",
    t: "gh",
  },
  {
    n: "ChatGPT",
    d: "chatgpt.com",
    u: "https://chatgpt.com/?prompt={{{s}}}",
    t: "chatgpt",
  },
  {
    n: "Claude",
    d: "claude.ai",
    u: "https://claude.ai/new?q={{{s}}}",
    t: "claude",
  },
  {
    n: "T3 Chat",
    d: "t3.chat",
    u: "https://t3.chat/new?q={{{s}}}",
    t: "t3",
  },
  {
    n: "npmx",
    d: "npmx.dev",
    u: "https://npmx.dev/search?q={{{s}}}",
    t: "npmx",
  },
  {
    n: "Reddit",
    d: "www.reddit.com",
    u: "https://www.reddit.com/search?q={{{s}}}",
    t: "reddit",
  },
];
