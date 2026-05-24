import { type TableOfContents, TOCItem, useActiveAnchors } from "fumadocs-core/toc";
import { type RefObject, useEffect, useRef } from "react";

import { cn } from "~/lib/utils";

interface Props {
  toc: TableOfContents;
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function Toc({ toc, containerRef }: Props) {
  const itemsRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const active = useActiveAnchors();

  useSmoothScrollActiveIntoView(containerRef, itemsRef, active);
  useTocThumb(itemsRef, thumbRef, active);

  return (
    <div className="sticky top-4 flex max-h-[calc(100svh-4rem)] flex-col p-10 md:p-12">
      <div className="mb-5.5 shrink-0 font-semibold">On this page</div>
      <div
        ref={containerRef}
        className="relative min-h-0 overflow-y-auto py-1 scrollbar-none mask-[linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={itemsRef} className="relative flex flex-col gap-3">
          <div
            ref={thumbRef}
            aria-hidden
            className="absolute left-0 w-0.5 rounded-e-sm bg-foreground transition-[top,height,opacity] duration-150 ease-out"
            style={{
              top: "var(--fd-top)",
              height: "var(--fd-height)",
              opacity: 0,
            }}
          />
          {toc.map((item) => (
            <TOCItem
              key={item.url}
              href={item.url}
              className={cn(
                "text-muted-foreground hover:text-foreground block text-sm no-underline transition-colors duration-150 ease-in",
                "data-[active=true]:text-foreground",
              )}
              style={{ marginLeft: `${(item.depth - 2) * 12 + 12}px` }}
            >
              {item.title}
            </TOCItem>
          ))}
        </div>
      </div>
    </div>
  );
}

const SCROLL_DURATION_MS = 450;
const SCROLL_MIN_DELTA = 1;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useSmoothScrollActiveIntoView(
  containerRef: RefObject<HTMLElement | null>,
  itemsRef: RefObject<HTMLElement | null>,
  active: string[],
) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const itemsEl = itemsRef.current;
    const firstId = active[0];

    if (!container || !itemsEl || !firstId) return;

    const itemEl = itemsEl.querySelector<HTMLElement>(`a[href="#${CSS.escape(firstId)}"]`);
    if (!itemEl) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const itemOffsetInContent = itemRect.top - containerRect.top + container.scrollTop;
    const targetTop = itemOffsetInContent - container.clientHeight / 2 + itemRect.height / 2;

    const clamped = Math.max(
      0,
      Math.min(targetTop, container.scrollHeight - container.clientHeight),
    );

    const startTop = container.scrollTop;

    const delta = clamped - startTop;
    if (Math.abs(delta) < SCROLL_MIN_DELTA) return;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / SCROLL_DURATION_MS, 1);
      container.scrollTop = startTop + delta * easeOutCubic(t);
      rafRef.current = t < 1 ? requestAnimationFrame(tick) : null;
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [active, containerRef, itemsRef]);
}

function useTocThumb(
  itemsRef: RefObject<HTMLElement | null>,
  thumbRef: RefObject<HTMLElement | null>,
  active: string[],
) {
  useEffect(() => {
    const container = itemsRef.current;
    const thumb = thumbRef.current;

    if (!container || !thumb) return;

    const items = active
      .map((id) => container.querySelector<HTMLElement>(`a[href="#${CSS.escape(id)}"]`))
      .filter((el): el is HTMLElement => el !== null);

    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) {
      thumb.style.opacity = "0";
      return;
    }

    const top = first.offsetTop;
    const bottom = last.offsetTop + last.clientHeight;

    thumb.style.opacity = "1";
    thumb.style.setProperty("--fd-top", `${top}px`);
    thumb.style.setProperty("--fd-height", `${bottom - top}px`);
  }, [active, itemsRef, thumbRef]);
}
