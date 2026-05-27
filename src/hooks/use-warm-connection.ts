import { useEffect } from "react";

export function useWarmConnection(domain: string | undefined): void {
  useEffect(() => {
    if (!domain) return;

    const href = `https://${domain}`;
    const links = (["preconnect", "dns-prefetch"] as const).map((rel) => {
      const link = document.createElement("link");

      link.rel = rel;
      link.href = href;

      document.head.append(link);

      return link;
    });

    return () => {
      for (const link of links) link.remove();
    };
  }, [domain]);
}
