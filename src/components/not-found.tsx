import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4 text-center">
      <div className="space-y-5">
        <h1 className="text-7xl font-bold">404</h1>
        <h2 className="text-2xl font-medium">Page Not Found</h2>
        <p className="text-muted-foreground">
          It looks like the page you're looking for doesn't exist.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
