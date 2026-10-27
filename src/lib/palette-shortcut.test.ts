import { describe, expect, it } from "vitest";

import { paletteKeyAction, paletteShortcutLabel } from "./palette-shortcut";

const base = {
  key: "k",
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  isComposing: false,
  repeat: false,
};

describe("paletteKeyAction", () => {
  it("opens on Cmd+K on macOS and Ctrl+K elsewhere", () => {
    expect(paletteKeyAction({ ...base, metaKey: true }, true)).toBe("toggle");
    expect(paletteKeyAction({ ...base, ctrlKey: true }, false)).toBe("toggle");
  });

  it("ignores the other platform's modifier", () => {
    expect(paletteKeyAction({ ...base, ctrlKey: true }, true)).toBe("ignore");
    expect(paletteKeyAction({ ...base, metaKey: true }, false)).toBe("ignore");
  });

  it("accepts caps lock", () => {
    expect(paletteKeyAction({ ...base, key: "K", metaKey: true }, true)).toBe("toggle");
  });

  it("ignores a bare K, extra modifiers and other keys", () => {
    expect(paletteKeyAction(base, true)).toBe("ignore");
    expect(paletteKeyAction({ ...base, metaKey: true, shiftKey: true }, true)).toBe("ignore");
    expect(paletteKeyAction({ ...base, ctrlKey: true, altKey: true }, false)).toBe("ignore");
    expect(paletteKeyAction({ ...base, key: "j", metaKey: true }, true)).toBe("ignore");
  });

  it("swallows auto repeat from a held shortcut without toggling", () => {
    expect(paletteKeyAction({ ...base, metaKey: true, repeat: true }, true)).toBe("swallow");
  });

  it("ignores the key during IME composition", () => {
    expect(paletteKeyAction({ ...base, metaKey: true, isComposing: true }, true)).toBe("ignore");
  });
});

describe("paletteShortcutLabel", () => {
  it("names the platform's modifier", () => {
    expect(paletteShortcutLabel(true)).toBe("⌘K");
    expect(paletteShortcutLabel(false)).toBe("Ctrl K");
  });
});
