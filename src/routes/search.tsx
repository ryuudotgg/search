import { createFileRoute, useSearch } from "@tanstack/react-router";
import { cache, useEffect } from "react";
import { z } from "zod";
import type { Bang } from "../lib/common-bangs";
import { commonBangs } from "../lib/common-bangs";
import { buildBangUrl, parseBangTag } from "../lib/resolve";

const DEFAULT_BANG = localStorage.getItem("ryuu-bang") ?? "ddg";

const loadFullBangs = cache(async (): Promise<Bang[]> => {
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

function Search() {
  const { q: query } = useSearch({ from: "/search" });

  async function getBangFromQuery(query: string): Promise<Bang> {
    const tag = parseBangTag(query) ?? DEFAULT_BANG;

    let bang = commonBangs.find((b) => b.t === tag);
    if (!bang) {
      const fullBangs = await loadFullBangs();
      bang = fullBangs.find((b) => b.t === tag) ?? commonBangs[0] ?? fullBangs[0];
    }

    if (!bang) throw new Error("Missing Bang");

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
    return buildBangUrl(bang, searchQuery);
  }

  async function run(): Promise<void> {
    try {
      const redirectUrl = await getRedirectUrl();
      if (redirectUrl) window.location.replace(redirectUrl);
    } catch (error) {
      console.error("Search Failed:", error);
      redirectToHome();
    }
  }

  useEffect(() => {
    run();
  }, [query]);

  return <div className="min-h-screen min-w-screen bg-background" />;
}
