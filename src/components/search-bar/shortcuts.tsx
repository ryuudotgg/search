import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { commonBangs } from "../../lib/common-bangs";
import { getDefaultBang } from "../../lib/resolve";
import { engineIcons } from "./icons";

export interface Shortcut {
  tag: string;
  name: string | undefined;
  icon: ReactNode;
}

const fallbackIcon = <HugeiconsIcon icon={Search01Icon} className="size-6" />;

// Shown while typing an unrecognized bang.
export const fallbackShortcut: Shortcut = { tag: "other", name: undefined, icon: fallbackIcon };

export const shortcuts: Shortcut[] = [
  ...commonBangs.map((bang) => ({
    tag: bang.t,
    name: bang.n,
    icon: engineIcons[bang.t] ?? fallbackIcon,
  })),
  fallbackShortcut,
];

export function getDefaultShortcut(): Shortcut {
  const tag = getDefaultBang();
  return shortcuts.find((shortcut) => shortcut.tag === tag) ?? fallbackShortcut;
}
