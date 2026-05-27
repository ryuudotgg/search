import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "~/layout";
import { Footer } from "../components/footer";
import { Logo } from "../components/logo";
import { SearchBar } from "../components/search-bar";

export const Route = createFileRoute("/")({
  component: () => (
    <Layout>
      <Home />
    </Layout>
  ),
});

function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="animate-fade-in flex flex-1 flex-col items-center justify-center gap-10 px-4 max-md:justify-start max-md:pt-[12dvh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <p className="text-muted-foreground text-base sm:text-lg">
            Search any engine, instantly.
          </p>
        </div>

        <SearchBar />
      </main>

      <Footer />
    </div>
  );
}
