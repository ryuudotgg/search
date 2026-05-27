import {
  Aliexpress,
  Bing,
  Bluesky,
  BraveBrowser,
  ClaudeAI,
  Discord,
  Docker,
  DuckDuckGo,
  Ebay,
  Facebook,
  GitHubDark,
  GitHubLight,
  GitLab,
  Gmail,
  Google,
  GoogleCalendar,
  GoogleDrive,
  GoogleMaps,
  HuggingFace,
  Instagram,
  LinkedIn,
  Netflix,
  NPM,
  OpenAIDark,
  OpenAILight,
  PerplexityAI,
  Pinterest,
  ProtonMail,
  Python,
  Reddit,
  RustDark,
  RustLight,
  SoundCloudDark,
  SoundCloudLight,
  Spotify,
  Steam,
  T3StackDark,
  T3StackLight,
  TikTokDark,
  TikTokLight,
  Twitch,
  Twitter,
  XDark,
  XLight,
  YouTube,
} from "@ridemountainpig/svgl-react";
import type { ReactNode, SVGProps } from "react";
import { useTheme } from "~/components/theme-provider";
import { Amazon } from "./Amazon";
import { CodePen } from "./CodePen";
import { DeepL } from "./DeepL";
import { Ecosia } from "./Ecosia";
import { Etsy } from "./Etsy";
import { HackerNews } from "./HackerNews";
import { IMDb } from "./IMDb";
import { Kagi } from "./Kagi";
import { Mdn } from "./Mdn";
import { NixOS } from "./NixOS";
import { Npmx } from "./Npmx";
import { Startpage } from "./Startpage";
import { Target } from "./Target";
import { TMDB } from "./TMDB";
import { Tumblr } from "./Tumblr";
import { Vimeo } from "./Vimeo";
import { Walmart } from "./Walmart";
import { Wikipedia } from "./Wikipedia";
import { WolframAlpha } from "./WolframAlpha";
import { Yahoo } from "./Yahoo";
import { Yandex } from "./Yandex";
import { Zillow } from "./Zillow";

type SvgIcon = (props: SVGProps<SVGSVGElement>) => ReactNode;

function themed(Light: SvgIcon, Dark: SvgIcon) {
  return function ThemedIcon({ className }: { className?: string }) {
    const { theme } = useTheme();
    const Icon = theme === "light" ? Light : Dark;

    return <Icon className={className} />;
  };
}

const GitHub = themed(GitHubLight, GitHubDark);
const ChatGPT = themed(OpenAILight, OpenAIDark);
const T3 = themed(T3StackLight, T3StackDark);
const Rust = themed(RustLight, RustDark);
const SoundCloud = themed(SoundCloudLight, SoundCloudDark);
const X = themed(XLight, XDark);
const TikTok = themed(TikTokLight, TikTokDark);

export const engineIcons: Record<string, ReactNode> = {
  // Search Engines
  ddg: <DuckDuckGo className="size-full" />,
  g: <Google className="size-full" />,
  bing: <Bing className="size-full" />,
  brave: <BraveBrowser className="size-full" />,
  kagi: <Kagi className="size-full" />,
  startpage: <Startpage className="size-full" />,
  ecosia: <Ecosia className="size-full" />,
  yandex: <Yandex className="size-full" />,
  y: <Yahoo className="size-full" />,

  // AI
  chatgpt: <ChatGPT className="size-full" />,
  claude: <ClaudeAI className="size-full" />,
  t3: <T3 className="size-full" />,
  perplexity: <PerplexityAI className="size-full" />,
  hf: <HuggingFace className="size-full" />,

  // Reference
  w: <Wikipedia className="size-full" />,
  wa: <WolframAlpha className="size-full" />,

  // Dev
  gh: <GitHub className="size-full" />,
  npm: <NPM className="size-full" />,
  npmx: <Npmx className="size-full" />,
  dh: <Docker className="size-full" />,
  gitlab: <GitLab className="size-full" />,
  py: <Python className="size-full" />,
  pypi: <Python className="size-full" />,
  rust: <Rust className="size-full" />,
  mdn: <Mdn className="size-full" />,
  codepen: <CodePen className="size-full" />,
  hn: <HackerNews className="size-full" />,
  nixpkgs: <NixOS className="size-full" />,

  // Media
  yt: <YouTube className="size-full" />,
  spotify: <Spotify className="size-full" />,
  nf: <Netflix className="size-full" />,
  twitch: <Twitch className="size-full" />,
  steam: <Steam className="size-full" />,
  sc: <SoundCloud className="size-full" />,
  imdb: <IMDb className="size-full" />,
  vimeo: <Vimeo className="size-full" />,
  tmdb: <TMDB className="size-full" />,

  // Social
  reddit: <Reddit className="size-full" />,
  x: <X className="size-full" />,
  tw: <Twitter className="size-full" />,
  fb: <Facebook className="size-full" />,
  ig: <Instagram className="size-full" />,
  li: <LinkedIn className="size-full" />,
  p: <Pinterest className="size-full" />,
  discord: <Discord className="size-full" />,
  tiktok: <TikTok className="size-full" />,
  bsky: <Bluesky className="size-full" />,
  tumblr: <Tumblr className="size-full" />,

  // Google
  gmail: <Gmail className="size-full" />,
  maps: <GoogleMaps className="size-full" />,
  drive: <GoogleDrive className="size-full" />,
  gcal: <GoogleCalendar className="size-full" />,

  // Shopping
  a: <Amazon className="size-full" />,
  e: <Ebay className="size-full" />,
  ali: <Aliexpress className="size-full" />,
  etsy: <Etsy className="size-full" />,
  walmart: <Walmart className="size-full" />,
  target: <Target className="size-full" />,
  zillow: <Zillow className="size-full" />,

  // Other
  protonmail: <ProtonMail className="size-full" />,
  deepl: <DeepL className="size-full" />,
};
