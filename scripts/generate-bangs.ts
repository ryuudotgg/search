// Generates the long-tail bang lookup assets served from /bangs.
//
// Reads the merged table (bangs/index.ts) and emits:
//   public/bangs/<char>.json  compact redirect maps { "<tag>": ["<u>", "<d>"] },
//                             sharded by the tag's first char (a-z, "_" fallback),
//                             with every alias expanded into its own key. Names are
//                             dropped: they aren't needed to redirect.
//   public/bangs/index.json   [[tag, name, domain], ...] for the bang directory.
//
// Re-run after refreshing the table:  bun scripts/generate-bangs.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { shardFor } from "~/lib/shard";
import { bangs } from "../bangs";

const shards = new Map<string, Record<string, [string, string]>>();
const index: [string, string, string][] = [];

for (const bang of bangs) {
  index.push([bang.t, bang.s, bang.d]);

  const target: [string, string] = [bang.u, bang.d];
  for (const tag of [bang.t, ...(bang.a ?? [])]) {
    const key = tag.toLowerCase();
    const shard = shardFor(key);

    let map = shards.get(shard);
    if (!map) {
      map = {};
      shards.set(shard, map);
    }

    if (!(key in map)) map[key] = target;
  }
}

const outDir = fileURLToPath(new URL("../public/bangs/", import.meta.url));
mkdirSync(outDir, { recursive: true });

for (const [shard, map] of shards) {
  const sorted: Record<string, [string, string]> = {};
  for (const key of Object.keys(map).sort()) {
    const value = map[key];
    if (value) sorted[key] = value;
  }

  writeFileSync(`${outDir}${shard}.json`, JSON.stringify(sorted));
}

writeFileSync(`${outDir}index.json`, JSON.stringify(index));

console.log(`Done.`);
process.exit(0);
