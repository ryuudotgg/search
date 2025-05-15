import { createFileRoute, useSearch } from "@tanstack/react-router";
import { cache, useEffect } from "react";
import { z } from "zod";
import { commonBangs } from "../lib/common-bangs";
import type { Bang } from "../lib/common-bangs";

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

    let bang = bangCandidate
      ? commonBangs.find((b) => b.t === bangCandidate)
      : commonBangs.find((b) => b.t === DEFAULT_BANG);

    if (!bang) {
      const fullBangs = await loadFullBangs();

      bang = bangCandidate
        ? fullBangs.find((b) => b.t === bangCandidate)
        : fullBangs.find((b) => b.t === DEFAULT_BANG);

      if (!bang) bang = commonBangs[0] ?? fullBangs[0];
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

    const cleanQuery = searchQuery.replace(BANG_REPLACEMENT_REGEX, "").trim();
    if (cleanQuery === "") return redirectToHome();

    const searchUrl = bang.u.replace(
      "{{{s}}}",
      encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    run();
  }, [query]);

  return <div className="min-h-screen min-w-screen bg-background" />;
}
