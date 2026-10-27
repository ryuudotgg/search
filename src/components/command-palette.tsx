import { Book02Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Cross } from "~/components/cross";
import { EngineGlyph, themeOptions } from "~/components/options-popup";
import { useTheme } from "~/components/theme-provider";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useDefaultBang } from "~/hooks/use-default-bang";
import { searchEngines } from "~/lib/common-bangs";

type PaletteCommand = {
  id: string;
  label: string;
  search: string;
  icon: ReactNode;
  checked: boolean;
  run: () => void;
};

type PaletteGroup = { value: string; items: PaletteCommand[] };

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [defaultTag, setDefaultTag] = useDefaultBang();
  const { theme, setTheme } = useTheme();

  const groups: PaletteGroup[] = [
    {
      value: "Default Engine",
      items: searchEngines.map((engine) => ({
        id: `engine-${engine.t}`,
        label: engine.n ?? engine.t,
        search: `engine ${engine.n ?? ""} !${engine.t}`,
        icon: <EngineGlyph tag={engine.t} />,
        checked: engine.t === defaultTag,
        run: () => setDefaultTag(engine.t),
      })),
    },
    {
      value: "Theme",
      items: themeOptions.map((option) => ({
        id: `theme-${option.value}`,
        label: option.label,
        search: `theme ${option.label}`,
        icon: <HugeiconsIcon icon={option.icon} />,
        checked: option.value === theme,
        run: () => setTheme(option.value),
      })),
    },
    {
      value: "Go To",
      items: [
        {
          id: "go-bangs",
          label: "Bang Directory",
          search: "go bang directory bangs",
          icon: <HugeiconsIcon icon={Book02Icon} />,
          checked: false,
          run: () => navigate({ to: "/bangs" }),
        },
        {
          id: "go-privacy",
          label: "Privacy Policy",
          search: "go privacy policy",
          icon: <HugeiconsIcon icon={Shield01Icon} />,
          checked: false,
          run: () => navigate({ to: "/privacy" }),
        },
      ],
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Commands">
      <Cross corner="tl" />
      <Cross corner="tr" />
      <Cross corner="bl" />
      <Cross corner="br" />

      <Command
        inline
        open
        autoHighlight="always"
        items={groups}
        itemToStringValue={(command: PaletteCommand) => command.search}
      >
        <CommandInput placeholder="Type a command..." aria-label="Search commands" />
        <CommandEmpty>No matching commands</CommandEmpty>
        <CommandList>
          {(group: PaletteGroup) => (
            <CommandGroup key={group.value} items={group.items}>
              <CommandGroupLabel>{group.value}</CommandGroupLabel>
              <CommandCollection>
                {(command: PaletteCommand) => (
                  <CommandItem
                    key={command.id}
                    value={command}
                    checked={command.checked}
                    onClick={() => {
                      command.run();
                      onOpenChange(false);
                    }}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {command.icon}
                    </span>
                    {command.label}
                  </CommandItem>
                )}
              </CommandCollection>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
