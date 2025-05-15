import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { cn } from "src/lib/utils";
import { z } from "zod";
import { shortcuts } from "./shortcuts";

const searchSchema = z.object({
  query: z.string().trim().min(1, "You need to enter a query."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export function SearchBar() {
  const navigate = useNavigate();

  const [activeShortcut, setActiveShortcut] = useState<(typeof shortcuts)[number]>(shortcuts[0]);

  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const query = form.watch("query");
  useEffect(() => {
    const match = query.match(/!(\S+)/i);
    if (!match) return setActiveShortcut(shortcuts[0]);

    const bangCandidate = match[1]?.toLowerCase();
    const shortcutMatch = (
      bangCandidate
        ? (shortcuts.find(
            (shortcut) => shortcut.tag === bangCandidate,
          ) as (typeof shortcuts)[number])
        : undefined
    ) as (typeof shortcuts)[number] | undefined;

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    setActiveShortcut(shortcutMatch ?? shortcuts[shortcuts.length - 1]!);
  }, [query]);

  const onSubmit = (values: SearchSchema) => {
    navigate({ to: "/search", search: { q: values.query } });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl transition-all duration-300 ease-in-out"
      >
        <div
          className={cn(
            "flex items-center px-4 h-14 rounded-full bg-accent transition-all duration-300 border border-transparent dark:bg-input/30",
          )}
        >
          <div className="flex items-center justify-center size-8 mr-2">{activeShortcut.icon}</div>

          <FormField
            name="query"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    autoFocus
                    placeholder={`Search${activeShortcut.name ? ` ${activeShortcut.name}` : ""}...`}
                    className="flex-1 border-0 shadow-none text-foreground placeholder:text-foreground text-lg px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent bg-transparent!"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="icon"
            className={cn(
              "rounded-full",
              "bg-foreground text-background",
              "transition-transform hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-custom-accent",
            )}
          >
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
