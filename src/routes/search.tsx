import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { commonBangs } from "../lib/common-bangs";
import { buildBangUrl, getDefaultBang, parseBangTag } from "../lib/resolve";
import { shardFor } from "../lib/shard";

type ResolvedBang = { d: string; u: string };
type Shard = Record<string, [u: string, d: string]>;

const shardCache = new Map<string, Promise<Shard>>();

function loadShard(shard: string): Promise<Shard> {
  let pending = shardCache.get(shard);
  if (!pending) {
    pending = fetch(`/bangs/${shard}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Shard ${shard}: ${res.status}`);
        return res.json() as Promise<Shard>;
      })
      .catch((error) => {
        shardCache.delete(shard);
        throw error;
      });

    shardCache.set(shard, pending);
  }

  return pending;
}

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

  const common = commonBangs.find((b) => b.t === tag || b.a?.includes(tag));
  if (common) return common;

  try {
    const entry = (await loadShard(shardFor(tag)))[tag];
    if (entry) return { u: entry[0], d: entry[1] };
  } catch (error) {
    console.error("Long Tail Bang Fetch Failed:", error);
  }

  const fallback = commonBangs[0];
  if (!fallback) throw new Error("Missing Bang");

  return fallback;
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
