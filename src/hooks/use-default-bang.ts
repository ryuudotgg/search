import { useCallback, useSyncExternalStore } from "react";

import { DEFAULT_BANG_EVENT, getDefaultBang, setDefaultBang } from "~/lib/resolve";

function subscribe(callback: () => void): () => void {
  window.addEventListener(DEFAULT_BANG_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(DEFAULT_BANG_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useDefaultBang(): [string, (tag: string) => void] {
  const tag = useSyncExternalStore(subscribe, getDefaultBang, () => "ddg");
  const setTag = useCallback((next: string) => setDefaultBang(next), []);

  return [tag, setTag];
}
