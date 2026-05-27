import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

export function TopBar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "border-border text-muted-foreground bg-background sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b px-4 font-mono text-xs tracking-[0.12em] uppercase",
        className,
      )}
    >
      <Link to="/" className="hover:text-foreground flex items-center gap-1.5 transition-colors">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
        Back
      </Link>
      <span>Ryuu's Search</span>
    </header>
  );
}
