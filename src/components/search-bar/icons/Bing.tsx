import bingUrl from "./bing.svg";

export function Bing({ className }: { className?: string }) {
  return <img src={bingUrl} alt="Bing" className={className} />;
}
