type ShortcutEvent = Pick<
  KeyboardEvent,
  "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey" | "isComposing"
>;

export function isMacPlatform(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

export function isPaletteShortcut(event: ShortcutEvent, mac: boolean): boolean {
  if (event.isComposing) return false;
  if (event.key.toLowerCase() !== "k") return false;
  if (event.altKey || event.shiftKey) return false;

  return mac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
}

export function paletteShortcutLabel(mac: boolean): string {
  return mac ? "⌘K" : "Ctrl K";
}
