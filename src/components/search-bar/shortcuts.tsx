import { GitHub } from "./icons/GitHub";
import { DuckDuckGo } from "./icons/DuckDuckGo";
import { Search } from "lucide-react";
import { Google } from "./icons/Google";
import { Wikipedia } from "./icons/Wikipedia";
import { YouTube } from "./icons/YouTube";

export const shortcuts = [
  {
    tag: "ddg",
    icon: <DuckDuckGo className="size-full" />,
    name: "DuckDuckGo",
  },
  {
    tag: "g",
    icon: <Google className="size-full" />,
    name: "Google",
  },
  {
    tag: "yt",
    icon: <YouTube className="size-full" />,
    name: "YouTube",
  },
  {
    tag: "w",
    icon: <Wikipedia className="size-full" />,
    name: "Wikipedia",
  },
  {
    tag: "gh",
    icon: <GitHub className="size-full" />,
    name: "GitHub",
  },

  // Uncommon Fallback
  {
    tag: "other",
    icon: <Search className="size-6" />,
    name: undefined,
  },
] as const;
