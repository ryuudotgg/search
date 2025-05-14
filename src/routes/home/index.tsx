import { SearchBar } from "./components/SearchBar";
import { Logo } from "./components/Logo";
import { Footer } from "./components/Footer";

export function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-12">
        <div className="animate-fade-in space-y-2">
          <Logo />

          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl font-light text-foreground">
              I'm faster than DuckDuckGo's Bangs.
            </h2>
          </div>
        </div>

        <SearchBar />
      </div>

      <Footer />
    </div>
  );
}
