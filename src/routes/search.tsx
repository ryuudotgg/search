import { createFileRoute, useSearch } from "@tanstack/react-router";
import { cache, useEffect } from "react";
import { z } from "zod";
import { commonBangs } from "../lib/common-bangs";
import { buildBangUrl, getDefaultBang, parseBangTag } from "../lib/resolve";

type ResolvedBang = { d: string; u: string; t: string; a?: string[] };

const loadFullBangs = cache(async (): Promise<ResolvedBang[]> => {
  const { bangs } = await import("../lib/bangs");
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

async function getBangFromQuery(query: string): Promise<ResolvedBang> {
  const tag = parseBangTag(query) ?? getDefaultBang();

  let bang: ResolvedBang | undefined = commonBangs.find((b) => b.t === tag);
  if (!bang) {
    const fullBangs = await loadFullBangs();
    bang =
      fullBangs.find((b) => b.t === tag || b.a?.includes(tag)) ?? commonBangs[0] ?? fullBangs[0];
  }

  if (!bang) throw new Error("Missing Bang");

  return bang;
}

function redirectToHome() {
  window.location.replace(window.location.origin);
}

function Search() {
  const { q: query } = useSearch({ from: "/search" });

  useEffect(() => {
    async function run() {
      try {
        const searchQuery = query?.trim() ?? "";
        if (!searchQuery) return redirectToHome();

        const bang = await getBangFromQuery(searchQuery);
        window.location.replace(buildBangUrl(bang, searchQuery));
      } catch (error) {
        console.error("Search Failed:", error);
        redirectToHome();
      }
    }

    run();
  }, [query]);

  return <div className="min-h-screen min-w-screen bg-background" />;
}
