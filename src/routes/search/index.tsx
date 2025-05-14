import { useSearchParams } from "react-router";
import { useEffect, cache } from "react";
import { commonBangs } from "./common-bangs";
import type { Bang } from "./common-bangs";

const DEFAULT_BANG = localStorage.getItem("default-bang") ?? "ddg";

const BANG_REGEX = /!(\S+)/i;
const BANG_REPLACEMENT_REGEX = /!\S+\s*/i;

const loadFullBangs = cache(async (): Promise<Bang[]> => {
  const { bangs } = await import("./bang");
  return bangs;
});

export function Search() {
  const [searchParams] = useSearchParams();

  async function getBangFromQuery(query: string): Promise<Bang> {
    const match = query.match(BANG_REGEX);

    const bangCandidate = match?.[1]?.toLowerCase();

    let bang: Bang | undefined;
    if (bangCandidate) {
      bang = commonBangs.find((b) => b.t === bangCandidate);

      if (!bang) {
        const fullBangs = await loadFullBangs();
        bang = fullBangs.find((b) => b.t === bangCandidate);
      }
    }

    if (!bang) {
      let defaultBang = commonBangs.find((bang) => bang.t === DEFAULT_BANG);
      if (!defaultBang) {
        const fullBangs = await loadFullBangs();
        defaultBang = fullBangs.find((b) => b.t === DEFAULT_BANG);
      }

      bang = commonBangs[0]!;
    }

    return bang;
  }

  function redirectToHome() {
    window.location.replace(window.location.origin);
    return null;
  }

  async function getRedirectUrl(): Promise<string | null> {
    const query = searchParams.get("q")?.trim() ?? "";
    if (!query) return redirectToHome();

    const bang = await getBangFromQuery(query);

    const cleanQuery = query.replace(BANG_REPLACEMENT_REGEX, "").trim();
    if (cleanQuery === "") return redirectToHome();

    const searchUrl = bang.u.replace(
      "{{{s}}}",
      encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
    );

    if (!searchUrl) return null;

    return searchUrl;
  }

  async function run(): Promise<void> {
    try {
      const redirectUrl = await getRedirectUrl();
      if (redirectUrl) window.location.replace(redirectUrl);
    } catch (error) {
      console.error("Search Failed:", error);
      redirectToHome();
    } finally {
    }
  }

  useEffect(() => {
    run();
  }, [searchParams]);

  return <div className="min-h-screen min-w-screen bg-background" />;
}
