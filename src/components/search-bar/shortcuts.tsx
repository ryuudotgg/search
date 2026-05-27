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

export const fallbackShortcut: Shortcut = { tag: "other", name: undefined, icon: fallbackIcon };
export const shortcuts: Shortcut[] = [
  ...commonBangs.flatMap((bang) => {
    const icon = engineIcons[bang.t] ?? fallbackIcon;
    return [bang.t, ...(bang.a ?? [])].map((tag) => ({ tag, name: bang.n, icon }));
  }),
  fallbackShortcut,
];

export function getDefaultShortcut(): Shortcut {
  const tag = getDefaultBang();
  return shortcuts.find((shortcut) => shortcut.tag === tag) ?? fallbackShortcut;
}
