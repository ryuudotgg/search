import { CommandIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { lazy, Suspense, useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { isMacPlatform, isPaletteShortcut, paletteShortcutLabel } from "~/lib/palette-shortcut";

const CommandPalette = lazy(() =>
  import("~/components/command-palette").then((module) => ({ default: module.CommandPalette })),
);

export function CommandPaletteLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mac] = useState(isMacPlatform);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isPaletteShortcut(event, mac)) return;

      event.preventDefault();
      setMounted(true);
      setOpen((current) => !current);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mac]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Commands"
              aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
              onClick={() => {
                setMounted(true);
                setOpen(true);
              }}
            />
          }
        >
          <HugeiconsIcon icon={CommandIcon} />
        </TooltipTrigger>
        <TooltipContent>Commands {paletteShortcutLabel(mac)}</TooltipContent>
      </Tooltip>

      {mounted && (
        <Suspense fallback={null}>
          <CommandPalette open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
}
