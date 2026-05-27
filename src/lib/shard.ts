export function shardFor(tag: string): string {
  const first = tag[0];
  return first && first >= "a" && first <= "z" ? first : "_";
}
