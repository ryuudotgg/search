import { Autocomplete as CommandPrimitive } from "@base-ui/react/autocomplete";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { SearchIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";

import { cn } from "~/lib/utils";

const Command = CommandPrimitive.Root;

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  ...props
}: Omit<DialogPrimitive.Root.Props, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="dialog-overlay"
          className="fixed inset-0 isolate z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-sm"
        />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "fixed top-1/3 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-none border border-border bg-popover text-sm text-popover-foreground outline-none sm:max-w-md",
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CommandInput({ className, ...props }: CommandPrimitive.Input.Props) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="border-border flex h-12 items-center gap-2 border-b px-4"
    >
      <HugeiconsIcon
        icon={SearchIcon}
        strokeWidth={2}
        className="size-3.5 shrink-0 text-muted-foreground"
      />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: CommandPrimitive.List.Props) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-[min(18rem,calc(66dvh-5rem))] scroll-py-1.5 overflow-x-hidden overflow-y-auto outline-none data-empty:hidden",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: CommandPrimitive.Empty.Props) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "text-muted-foreground font-mono text-xs tracking-[0.12em] uppercase empty:hidden py-6 text-center",
        className,
      )}
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: CommandPrimitive.Group.Props) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn("overflow-hidden p-1.5 text-foreground", className)}
      {...props}
    />
  );
}

function CommandGroupLabel({ className, ...props }: CommandPrimitive.GroupLabel.Props) {
  return (
    <CommandPrimitive.GroupLabel
      data-slot="command-group-label"
      className={cn(
        "text-muted-foreground/70 px-3 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

const CommandCollection = CommandPrimitive.Collection;

function CommandSeparator({ className, ...props }: CommandPrimitive.Separator.Props) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("h-px bg-border", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  checked,
  ...props
}: CommandPrimitive.Item.Props & { checked?: boolean }) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      data-checked={checked || undefined}
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-none px-3 py-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground max-md:min-h-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    >
      {children}
      {checked && <span className="sr-only">(current)</span>}
      <HugeiconsIcon
        icon={Tick02Icon}
        strokeWidth={2}
        className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-checked/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto font-mono text-xs tracking-widest text-muted-foreground group-data-highlighted/command-item:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandCollection,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
