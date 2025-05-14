import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, cache } from "react";
import { commonBangs } from "../lib/common-bangs";
import type { Bang } from "../lib/common-bangs";
import { z } from "zod";

const DEFAULT_BANG = localStorage.getItem("ryuu-bang") ?? "ddg";

const BANG_REGEX = /!(\S+)/i;
const BANG_REPLACEMENT_REGEX = /!\S+\s*/i;

const loadFullBangs = cache(async (): Promise<Bang[]> => {
  const { bangs } = await import("../lib/bang");
  return bangs;
});

const searchSchema = z.object({
  q: z.string().trim().optional(),
});

export const Route = createFileRoute("/search")({
  component: Search,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({ meta: [{ title: "Redirecting..." }] }),
});

function Search() {
  const { q: query } = useSearch({ from: "/search" });

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
    const searchQuery = query?.trim() ?? "";
    if (!searchQuery) return redirectToHome();

    const bang = await getBangFromQuery(searchQuery);

    const cleanQuery = searchQuery.replace(BANG_REPLACEMENT_REGEX, "").trim();
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
  }, [query]);

  return <div className="min-h-screen min-w-screen bg-background" />;
}
