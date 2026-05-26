import { OptionsPopup } from "./components/options-popup";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}

        <Toaster />
        <div className="absolute bottom-4 right-4">
          <OptionsPopup />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
