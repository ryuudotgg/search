import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { commonBangs } from "../../lib/common-bangs";
import { ChatGPT } from "./icons/ChatGPT";
import { Claude } from "./icons/Claude";
import { DuckDuckGo } from "./icons/DuckDuckGo";
import { GitHub } from "./icons/GitHub";
import { Google } from "./icons/Google";
import { Npmx } from "./icons/Npmx";
import { Reddit } from "./icons/Reddit";
import { T3 } from "./icons/T3";
import { Wikipedia } from "./icons/Wikipedia";
import { YouTube } from "./icons/YouTube";

export interface Shortcut {
  tag: string;
  name: string | undefined;
  icon: ReactNode;
}

const icons: Record<string, ReactNode> = {
  ddg: <DuckDuckGo className="size-full" />,
  g: <Google className="size-full" />,
  yt: <YouTube className="size-full" />,
  w: <Wikipedia className="size-full" />,
  gh: <GitHub className="size-full" />,
  chatgpt: <ChatGPT className="size-full" />,
  claude: <Claude className="size-full" />,
  t3: <T3 className="size-full" />,
  npmx: <Npmx className="size-full" />,
  reddit: <Reddit className="size-full" />,
};

const fallbackIcon = <Search className="size-6" />;

// Shown while typing an unrecognized bang.
export const fallbackShortcut: Shortcut = { tag: "other", name: undefined, icon: fallbackIcon };

export const shortcuts: Shortcut[] = [
  ...commonBangs.map((bang) => ({
    tag: bang.t,
    name: bang.n,
    icon: icons[bang.t] ?? fallbackIcon,
  })),
  fallbackShortcut,
];

export const defaultShortcut: Shortcut = shortcuts[0] ?? fallbackShortcut;
