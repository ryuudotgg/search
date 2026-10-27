type ShortcutEvent = Pick<
  KeyboardEvent,
  "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey" | "isComposing" | "repeat"
>;

export function isMacPlatform(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

export type PaletteKeyAction = "toggle" | "swallow" | "ignore";

export function paletteKeyAction(event: ShortcutEvent, mac: boolean): PaletteKeyAction {
  if (event.isComposing) return "ignore";
  if (event.key.toLowerCase() !== "k") return "ignore";
  if (event.altKey || event.shiftKey) return "ignore";

  const modifier = mac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
  if (!modifier) return "ignore";

  return event.repeat ? "swallow" : "toggle";
}

export function paletteShortcutLabel(mac: boolean): string {
  return mac ? "⌘K" : "Ctrl K";
}
