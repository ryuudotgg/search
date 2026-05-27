import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useDefaultBang } from "~/hooks/use-default-bang";
import { useWarmConnection } from "~/hooks/use-warm-connection";
import { commonBangs } from "~/lib/common-bangs";
import { parseBangTag } from "~/lib/resolve";
import { Cross } from "../cross";
import { fallbackShortcut, type Shortcut, shortcuts } from "./shortcuts";

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

  const query = form.watch("query");
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

  const onSubmit = (values: SearchSchema) => {
    navigate({ to: "/search", search: { q: values.query } });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl">
        <div className="relative">
          <Cross corner="tl" />
          <Cross corner="tr" />
          <Cross corner="bl" />
          <Cross corner="br" />

          <div className="border-border bg-accent/20 dark:bg-input/20 flex h-16 items-stretch border">
            <div className="border-border flex w-16 shrink-0 items-center justify-center border-r">
              <div className="flex size-7 items-center justify-center">{activeShortcut.icon}</div>
            </div>

            <FormField
              name="query"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl
                    render={
                      <Input
                        autoFocus
                        placeholder={`Search${activeShortcut.name ? ` ${activeShortcut.name}` : ""}...`}
                        className="text-foreground placeholder:text-muted-foreground h-full w-full rounded-none border-0 bg-transparent! px-4 text-lg shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    }
                  />
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

        <div className="text-muted-foreground mt-3 flex items-center justify-between font-mono text-xs tracking-[0.12em] uppercase">
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
