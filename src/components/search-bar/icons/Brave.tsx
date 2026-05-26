import braveUrl from "./brave.svg";

export function Brave({ className }: { className?: string }) {
  return <img src={braveUrl} alt="Brave" className={className} />;
}
