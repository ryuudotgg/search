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
    n: "Bing",
    d: "www.bing.com",
    u: "https://www.bing.com/search?q={{{s}}}",
    t: "bing",
  },
  {
    n: "Brave",
    d: "search.brave.com",
    u: "https://search.brave.com/search?q={{{s}}}",
    t: "brave",
  },
  {
    n: "Startpage",
    d: "www.startpage.com",
    u: "https://www.startpage.com/sp/search?query={{{s}}}",
    t: "startpage",
  },
  {
    n: "Ecosia",
    d: "www.ecosia.org",
    u: "https://www.ecosia.org/search?q={{{s}}}",
    t: "ecosia",
  },
  {
    n: "Yandex",
    d: "yandex.com",
    u: "https://yandex.com/search/?text={{{s}}}",
    t: "yandex",
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

const SEARCH_ENGINE_TAGS = new Set(["ddg", "g", "bing", "brave", "startpage", "ecosia", "yandex"]);
export const searchEngines: Bang[] = commonBangs.filter((bang) => SEARCH_ENGINE_TAGS.has(bang.t));
