import type { ReactNode } from "react";

import { Bing } from "./Bing";
import { Brave } from "./Brave";
import { ChatGPT } from "./ChatGPT";
import { Claude } from "./Claude";
import { DuckDuckGo } from "./DuckDuckGo";
import { Ecosia } from "./Ecosia";
import { GitHub } from "./GitHub";
import { Google } from "./Google";
import { Npmx } from "./Npmx";
import { Reddit } from "./Reddit";
import { Startpage } from "./Startpage";
import { T3 } from "./T3";
import { Wikipedia } from "./Wikipedia";
import { Yandex } from "./Yandex";
import { YouTube } from "./YouTube";

export const engineIcons: Record<string, ReactNode> = {
  ddg: <DuckDuckGo className="size-full" />,
  g: <Google className="size-full" />,
  bing: <Bing className="size-full" />,
  brave: <Brave className="size-full" />,
  startpage: <Startpage className="size-full" />,
  ecosia: <Ecosia className="size-full" />,
  yandex: <Yandex className="size-full" />,
  yt: <YouTube className="size-full" />,
  w: <Wikipedia className="size-full" />,
  gh: <GitHub className="size-full" />,
  chatgpt: <ChatGPT className="size-full" />,
  claude: <Claude className="size-full" />,
  t3: <T3 className="size-full" />,
  npmx: <Npmx className="size-full" />,
  reddit: <Reddit className="size-full" />,
};
