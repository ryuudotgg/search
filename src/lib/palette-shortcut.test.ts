import { describe, expect, it } from "vitest";

import { isPaletteShortcut, paletteShortcutLabel } from "./palette-shortcut";

const base = {
  key: "k",
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  isComposing: false,
};

describe("isPaletteShortcut", () => {
  it("opens on Cmd+K on macOS and Ctrl+K elsewhere", () => {
    expect(isPaletteShortcut({ ...base, metaKey: true }, true)).toBe(true);
    expect(isPaletteShortcut({ ...base, ctrlKey: true }, false)).toBe(true);
  });

  it("ignores the other platform's modifier", () => {
    expect(isPaletteShortcut({ ...base, ctrlKey: true }, true)).toBe(false);
    expect(isPaletteShortcut({ ...base, metaKey: true }, false)).toBe(false);
  });

  it("accepts caps lock", () => {
    expect(isPaletteShortcut({ ...base, key: "K", metaKey: true }, true)).toBe(true);
  });

  it("ignores a bare K, extra modifiers and other keys", () => {
    expect(isPaletteShortcut(base, true)).toBe(false);
    expect(isPaletteShortcut({ ...base, metaKey: true, shiftKey: true }, true)).toBe(false);
    expect(isPaletteShortcut({ ...base, ctrlKey: true, altKey: true }, false)).toBe(false);
    expect(isPaletteShortcut({ ...base, key: "j", metaKey: true }, true)).toBe(false);
  });

  it("ignores the key during IME composition", () => {
    expect(isPaletteShortcut({ ...base, metaKey: true, isComposing: true }, true)).toBe(false);
  });
});

describe("paletteShortcutLabel", () => {
  it("names the platform's modifier", () => {
    expect(paletteShortcutLabel(true)).toBe("⌘K");
    expect(paletteShortcutLabel(false)).toBe("Ctrl K");
  });
});
