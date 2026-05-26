import { ComputerIcon, Moon02Icon, Settings02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { engineIcons } from "~/components/search-bar/icons";
import { type Theme, useTheme } from "~/components/theme-provider";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select";
import { useDefaultBang } from "~/hooks/use-default-bang";
import { searchEngines } from "~/lib/common-bangs";

const themeOptions: { value: Theme; label: string; icon: typeof Sun03Icon }[] = [
  { value: "light", label: "Light", icon: Sun03Icon },
  { value: "dark", label: "Dark", icon: Moon02Icon },
  { value: "system", label: "System", icon: ComputerIcon },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-muted-foreground/70 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
      {children}
    </span>
  );
}

function EngineGlyph({ tag }: { tag: string }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center">{engineIcons[tag]}</span>
  );
}

export function OptionsPopup() {
  const [defaultTag, setDefaultTag] = useDefaultBang();
  const { theme, setTheme } = useTheme();

  const current = searchEngines.find((engine) => engine.t === defaultTag);

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="icon" aria-label="Options" />}>
        <HugeiconsIcon icon={Settings02Icon} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="flex flex-col gap-2">
          <SectionLabel>Default Engine</SectionLabel>
          <Select value={defaultTag} onValueChange={(value) => setDefaultTag(value as string)}>
            <SelectTrigger className="w-full">
              <span className="flex items-center gap-2">
                <EngineGlyph tag={defaultTag} />
                <span>{current?.n ?? "Select engine"}</span>
              </span>
            </SelectTrigger>
            <SelectContent>
              {searchEngines.map((engine) => (
                <SelectItem key={engine.t} value={engine.t}>
                  <EngineGlyph tag={engine.t} />
                  {engine.n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <SectionLabel>Theme</SectionLabel>
          <div className="flex gap-1">
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={theme === option.value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                aria-pressed={theme === option.value}
                aria-label={option.label}
                onClick={() => setTheme(option.value)}
              >
                <HugeiconsIcon icon={option.icon} />
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
