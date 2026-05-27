import type { Plugin } from "vite";
import { commonBangs } from "../lib/common-bangs";

// Common-bang and default searches resolve here before React loads, pulled from
// the `commonBangs` table; anything else falls through to the /search route.
export function instantRedirect(): Plugin {
  const bangs = Object.fromEntries(
    commonBangs.flatMap((bang) => {
      const target = { d: bang.d, u: bang.u };
      return [bang.t, ...(bang.a ?? [])].map((tag) => [tag, target]);
    }),
  );

  const script = `
(function () {
  if (location.pathname !== "/search") return;

  var query = (new URLSearchParams(location.search).get("q") || "").trim();
  if (!query) return;

  var bangs = ${JSON.stringify(bangs)};
  var defaultTag = localStorage.getItem("ryuu-bang") || "ddg";

  var match = query.match(/!(\\S+)/i);
  var bang = bangs[match ? match[1].toLowerCase() : defaultTag];
  if (!bang) return;

  var search = query.replace(/!\\S+\\s*/i, "").trim();
  location.replace(
    search
      ? bang.u.replace("{{{s}}}", encodeURIComponent(search).replace(/%2F/g, "/"))
      : "https://" + bang.d,
  );
})();
`;

  return {
    name: "instant-redirect",
    transformIndexHtml() {
      return [{ tag: "script", injectTo: "head-prepend", children: script }];
    },
  };
}
