import { commonBangs, Bang } from "./common-bangs";

const DEFAULT_BANG = localStorage.getItem("default-bang") ?? "ddg";

const BANG_REGEX = /!(\S+)/i;
const BANG_REPLACEMENT_REGEX = /!\S+\s*/i;

let fullBangsCache: Bang[] | null = null;
async function loadFullBangs(): Promise<Bang[]> {
  if (fullBangsCache) return fullBangsCache;

  const { bangs } = await import("./bang");
  fullBangsCache = bangs;

  return bangs;
}

async function getBangFromQuery(query: string): Promise<Bang> {
  const match = query.match(BANG_REGEX);

  const bangCandidate = match?.[1]?.toLowerCase();
  const defaultBang = commonBangs.find((bang) => bang.t === DEFAULT_BANG);

  let bang: Bang | undefined;
  if (bangCandidate) {
    bang = commonBangs.find((b) => b.t === bangCandidate);

    if (!bang) {
      const fullBangs = await loadFullBangs();
      bang = fullBangs.find((b) => b.t === bangCandidate);
    }
  }

  if (!bang) {
    if (defaultBang) bang = defaultBang;
    else {
      const fullBangs = await loadFullBangs();
      bang = fullBangs.find((b) => b.t === DEFAULT_BANG);
    }
  }

  if (!bang) throw new Error("Missing Bang");

  return bang;
}

async function getRedirectUrl(): Promise<string | null> {
  const url = new URL(window.location.href);

  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) return null;

  const bang = await getBangFromQuery(query);

  const cleanQuery = query.replace(BANG_REPLACEMENT_REGEX, "").trim();
  if (cleanQuery === "") return `https://${bang.d}`;

  const searchUrl = bang.u.replace(
    "{{{s}}}",
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );

  if (!searchUrl) return null;

  return searchUrl;
}

async function run(): Promise<void> {
  const redirectUrl = await getRedirectUrl();
  if (!redirectUrl) return;

  window.location.replace(redirectUrl);
}

run();
