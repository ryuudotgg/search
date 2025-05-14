import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}

        <Toaster />
        <div className="absolute bottom-4 right-4">
          <ThemeToggle />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
