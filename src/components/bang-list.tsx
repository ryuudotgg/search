import { ArrowUpRight01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { engineIcons } from "./search-bar/icons";
import { Button, buttonVariants } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export type BangEntry = [tag: string, name: string, domain: string];

const ROW_HEIGHT = 64;

export function BangList({ rows, className }: { rows: BangEntry[]; className?: string }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  if (!rows.length)
    return (
      <div
        className={cn(
          "text-muted-foreground flex items-center justify-center font-mono text-xs tracking-[0.12em] uppercase",
          className,
        )}
      >
        No matches
      </div>
    );

  return (
    <div ref={parentRef} className={cn("overflow-auto", className)}>
      <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => {
          const row = rows[item.index];
          if (!row) return null;

          return (
            <div
              key={item.key}
              className="absolute top-0 left-0 w-full"
              style={{ height: `${item.size}px`, transform: `translateY(${item.start}px)` }}
            >
              <BangRow tag={row[0]} name={row[1]} domain={row[2]} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BangRow({ tag, name, domain }: { tag: string; name: string; domain: string }) {
  const icon = engineIcons[tag];

  async function copyTag() {
    const text = `!${tag}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${text}`);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }

  return (
    <div className="border-border/60 hover:bg-accent/30 flex h-16 items-center gap-3 border-b px-3 transition-colors sm:px-4">
      <span className="flex size-8 shrink-0 items-center justify-center p-0.5">
        {icon ?? (
          <span className="border-border/60 text-muted-foreground flex size-full items-center justify-center border font-mono text-xs font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-foreground truncate text-sm font-medium">{name}</span>
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground w-fit max-w-full truncate text-xs transition-colors"
        >
          {domain}
        </a>
      </div>

      <code className="text-muted-foreground hidden shrink-0 font-mono text-xs sm:block">
        !{tag}
      </code>

      <div className="flex shrink-0 items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon-sm" onClick={copyTag} aria-label="Copy Tag" />
            }
          >
            <HugeiconsIcon icon={Copy01Icon} />
          </TooltipTrigger>
          <TooltipContent>Copy Tag</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                to="/search"
                search={{ q: `!${tag}` }}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                aria-label={`Go to ${name}`}
              />
            }
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} />
          </TooltipTrigger>
          <TooltipContent>Go to {name}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
