import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Layout } from "~/layout";
import { type BangEntry, BangList } from "../components/bang-list";
import { Cross } from "../components/cross";
import { Footer } from "../components/footer";
import { TopBar } from "../components/top-bar";
import { Input } from "../components/ui/input";
import { commonBangs } from "../lib/common-bangs";

export const Route = createFileRoute("/bangs")({
  component: () => (
    <Layout>
      <Bangs />
    </Layout>
  ),
  head: () => ({ meta: [{ title: "Bang Directory — Ryuu's Search" }] }),
});

const seedRows: BangEntry[] = commonBangs.map((bang) => [bang.t, bang.n ?? bang.t, bang.d]);

let indexPromise: Promise<BangEntry[]> | null = null;
function loadIndex(): Promise<BangEntry[]> {
  if (!indexPromise) {
    indexPromise = fetch("/bangs/index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch Failed: ${res.status}`);
        return res.json() as Promise<BangEntry[]>;
      })
      .catch((error) => {
        indexPromise = null;
        throw error;
      });
  }

  return indexPromise;
}

function filterBangs(rows: BangEntry[], query: string): BangEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;

  const prefix: BangEntry[] = [];
  const rest: BangEntry[] = [];

  for (const row of rows) {
    const [tag, name] = row;
    const lowerTag = tag.toLowerCase();

    if (lowerTag.startsWith(q)) prefix.push(row);
    else if (lowerTag.includes(q) || name.toLowerCase().includes(q)) rest.push(row);
  }

  return prefix.concat(rest);
}

function Bangs() {
  const [rows, setRows] = useState<BangEntry[]>(seedRows);
  const [failed, setFailed] = useState(false);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let active = true;
    loadIndex()
      .then((data) => active && setRows(data))
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => filterBangs(rows, deferredQuery), [rows, deferredQuery]);
  const isFiltering = deferredQuery.trim().length > 0;

  return (
    <div className="flex h-svh flex-col">
      <TopBar />

      <main className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-6 px-4 pt-8 sm:pt-12">
        <header className="flex shrink-0 flex-col items-center gap-5">
          <h1 className="text-foreground text-center text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Bang Directory
          </h1>

          <div className="relative w-full">
            <Cross corner="tl" />
            <Cross corner="tr" />
            <Cross corner="bl" />
            <Cross corner="br" />

            <div className="border-border bg-accent/20 dark:bg-input/20 flex h-14 items-stretch border">
              <div className="border-border text-muted-foreground flex w-14 shrink-0 items-center justify-center border-r">
                <HugeiconsIcon icon={Search01Icon} className="size-5" />
              </div>
              <Input
                type="search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or tag…"
                aria-label="Search bangs"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                className="text-foreground h-full touch-manipulation rounded-none border-0 bg-transparent px-4 text-base shadow-none focus-visible:ring-0 md:text-base dark:bg-transparent [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
          </div>

          <div className="text-muted-foreground flex w-full items-center justify-between font-mono text-xs tracking-[0.12em] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground/60">Directory ·</span>
              <span className="text-foreground/80">{rows.length.toLocaleString()} bangs</span>
            </span>
            <span className={failed ? "text-destructive" : "text-muted-foreground/60"}>
              {failed
                ? "Couldn't load full directory"
                : isFiltering
                  ? `${filtered.length.toLocaleString()} ${filtered.length === 1 ? "match" : "matches"}`
                  : "Type to filter"}
            </span>
          </div>
        </header>

        <div className="relative mb-2 min-h-0 flex-1">
          <Cross corner="tl" />
          <Cross corner="tr" />
          <Cross corner="bl" />
          <Cross corner="br" />

          <BangList rows={filtered} className="border-border h-full border" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
