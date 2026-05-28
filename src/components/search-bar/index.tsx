import { Autocomplete } from "@base-ui/react/autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ComboboxList, useComboboxAnchor } from "~/components/ui/combobox";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { useDefaultBang } from "~/hooks/use-default-bang";
import { useWarmConnection } from "~/hooks/use-warm-connection";
import { commonBangs } from "~/lib/common-bangs";
import { parseBangTag } from "~/lib/resolve";
import { cn } from "~/lib/utils";
import { Cross } from "../cross";
import { fallbackShortcut, type Shortcut, shortcuts } from "./shortcuts";
import { type BangSuggestion, useBangSuggestions } from "./use-bang-suggestions";

const searchSchema = z.object({
  query: z.string().trim().min(1, "You need to enter a query."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export function SearchBar() {
  const navigate = useNavigate();

  const [defaultTag] = useDefaultBang();
  const defaultShortcut = useMemo(
    () => shortcuts.find((shortcut) => shortcut.tag === defaultTag) ?? fallbackShortcut,
    [defaultTag],
  );
  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useComboboxAnchor();

  const overlayRef = useRef<HTMLFormElement | null>(null);
  const highlightedRef = useRef<BangSuggestion | null>(null);

  const [caret, setCaret] = useState(0);

  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) inputRef.current?.focus();
  }, []);

  // Size the mobile takeover to the visual viewport so it sits above the keyboard instead
  // of overflowing behind it.
  useEffect(() => {
    if (!focused) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const sync = () => {
      const el = overlayRef.current;
      if (!el) return;

      if (window.matchMedia("(max-width: 767px)").matches) {
        el.style.height = `${viewport.height}px`;
        el.style.top = `${viewport.offsetTop}px`;
      } else {
        el.style.height = "";
        el.style.top = "";
      }
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);

    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);

      const el = overlayRef.current;
      if (el) {
        el.style.height = "";
        el.style.top = "";
      }
    };
  }, [focused]);

  const query = form.watch("query");

  const { token, suggestions } = useBangSuggestions(query, caret);
  const open = suggestions.length > 0 && !dismissed;

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const activeShortcut = useMemo<Shortcut>(() => {
    const match = query.match(/!(\S+)/i);
    if (!match) return defaultShortcut;

    const bangCandidate = match[1]?.toLowerCase();
    return shortcuts.find((shortcut) => shortcut.tag === bangCandidate) ?? fallbackShortcut;
  }, [query, defaultShortcut]);

  const targetDomain = useMemo(() => {
    const tag = parseBangTag(query) ?? defaultTag;
    return commonBangs.find((bang) => bang.t === tag || bang.a?.includes(tag))?.d;
  }, [query, defaultTag]);

  useWarmConnection(targetDomain);

  const syncCaret = useCallback((event: React.SyntheticEvent<HTMLInputElement>) => {
    const position = event.currentTarget.selectionStart;
    if (position != null) setCaret(position);
  }, []);

  const complete = useCallback(
    (suggestion: BangSuggestion | undefined) => {
      const active = tokenRef.current;
      if (!suggestion || !active) return;

      const value = form.getValues("query");

      const before = value.slice(0, active.start);
      const after = value.slice(active.end);

      const needsSpace = after.length === 0 || !/^\s/.test(after);
      const inserted = `!${suggestion.tag}${needsSpace ? " " : ""}`;

      const nextCaret = before.length + inserted.length;

      form.setValue("query", before + inserted + after, { shouldValidate: true });

      setDismissed(true);
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;

        el.focus();
        el.setSelectionRange(nextCaret, nextCaret);

        setCaret(nextCaret);
      });
    },
    [form],
  );

  const onInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab" && open && suggestions.length > 0) {
        event.preventDefault();
        complete(highlightedRef.current ?? suggestions[0]);
      }
    },
    [open, suggestions, complete],
  );

  const dismiss = useCallback(() => {
    inputRef.current?.blur();
    setFocused(false);
    setDismissed(true);
  }, []);

  const onSubmit = (values: SearchSchema) => {
    navigate({ to: "/search", search: { q: values.query } });
  };

  return (
    <Form {...form}>
      <form
        ref={overlayRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "w-full max-w-xl",
          focused &&
            "max-md:fixed max-md:inset-0 max-md:z-40 max-md:m-0 max-md:flex max-md:max-w-none max-md:flex-col max-md:overflow-hidden max-md:bg-background max-md:p-0",
        )}
      >
        {focused && (
          <div className="text-muted-foreground border-border hidden h-12 shrink-0 items-center justify-between border-b px-4 pt-[env(safe-area-inset-top)] font-mono text-xs tracking-[0.12em] uppercase max-md:flex">
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={dismiss}
              className="hover:text-foreground flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
              Back
            </button>
            <span className="">Ryuu's Search</span>
          </div>
        )}

        <div className="relative">
          <div className={cn("contents", focused && "max-md:hidden")}>
            <Cross corner="tl" />
            <Cross corner="tr" />
            <Cross corner="bl" />
            <Cross corner="br" />
          </div>

          <div
            ref={anchorRef}
            className="border-border bg-accent/20 dark:bg-input/20 flex h-16 items-stretch border max-md:data-[focused=true]:border-x-0 max-md:data-[focused=true]:border-t-0"
            data-focused={focused}
          >
            <div className="border-border flex w-16 shrink-0 items-center justify-center border-r">
              <div className="flex size-7 items-center justify-center">{activeShortcut.icon}</div>
            </div>

            <FormField
              name="query"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Autocomplete.Root
                    modal={false}
                    value={field.value}
                    open={open}
                    onOpenChange={(nextOpen) => {
                      if (nextOpen) return;
                      if (window.matchMedia("(max-width: 767px)").matches) return;

                      setDismissed(true);
                    }}
                    onValueChange={(value, details) => {
                      if (details.reason === "item-press") return;

                      setDismissed(false);
                      field.onChange(value);
                    }}
                    onItemHighlighted={(item) => {
                      highlightedRef.current = (item as BangSuggestion | undefined) ?? null;
                    }}
                    itemToStringValue={(item: BangSuggestion) => `!${item.tag}`}
                  >
                    <FormControl
                      render={
                        <Autocomplete.Input
                          ref={(node) => {
                            inputRef.current = node;
                            field.ref(node);
                          }}
                          aria-label="Search query"
                          enterKeyHint="search"
                          autoCapitalize="none"
                          autoComplete="off"
                          spellCheck={false}
                          placeholder={`Search${activeShortcut.name ? ` ${activeShortcut.name}` : ""}...`}
                          className="text-foreground placeholder:text-muted-foreground h-full w-full touch-manipulation rounded-none border-0 bg-transparent! px-4 text-lg shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onFocus={() => {
                            setFocused(true);
                            setDismissed(false);
                          }}
                          onBlur={() => field.onBlur()}
                          onKeyDown={onInputKeyDown}
                          onKeyUp={syncCaret}
                          onClick={syncCaret}
                          onSelect={syncCaret}
                        />
                      }
                    />

                    <Autocomplete.Portal>
                      <Autocomplete.Positioner
                        anchor={anchorRef}
                        side="bottom"
                        align="start"
                        sideOffset={0}
                        collisionPadding={0}
                        collisionAvoidance={{ side: "none" }}
                        className="isolate z-50 w-(--anchor-width)"
                      >
                        <Autocomplete.Popup className="border-border bg-accent/20 dark:bg-input/20 max-h-(--available-height) w-(--anchor-width) overflow-hidden rounded-none border border-t-0 transition-[max-height] duration-200 ease-out data-ending-style:max-h-0 data-starting-style:max-h-0 max-md:border-x-0">
                          <ComboboxList className="max-md:max-h-none">
                            {suggestions.map((suggestion) => (
                              <Autocomplete.Item
                                key={suggestion.tag}
                                value={suggestion}
                                className="relative flex w-full cursor-default items-center gap-2.5 rounded-none px-3 py-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 max-md:min-h-11 max-md:px-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                                onClick={() => complete(suggestion)}
                              >
                                <span className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-5">
                                  {suggestion.icon}
                                </span>
                                <span className="flex-1 truncate">{suggestion.name}</span>
                                <span className="text-muted-foreground font-mono text-xs">
                                  !{suggestion.tag}
                                </span>
                              </Autocomplete.Item>
                            ))}
                          </ComboboxList>
                        </Autocomplete.Popup>
                      </Autocomplete.Positioner>
                    </Autocomplete.Portal>
                  </Autocomplete.Root>
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="border-border hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background flex w-16 shrink-0 items-center justify-center border-l transition-colors focus:outline-none"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>

        <div
          aria-hidden={open}
          className={cn(
            "text-muted-foreground mt-3 flex items-center justify-between font-mono text-xs tracking-[0.12em] uppercase transition-opacity duration-150",
            open ? "pointer-events-none opacity-0" : "opacity-100",
            focused && "max-md:hidden",
          )}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground/60">Engine ·</span>
            <span className="text-foreground/80 transition-colors duration-200">
              {activeShortcut.name ?? "Search"}
            </span>
          </span>
          <span className="text-muted-foreground/60">↵ to search</span>
        </div>
      </form>
    </Form>
  );
}
