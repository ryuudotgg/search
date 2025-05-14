import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="w-full py-4 text-accent-foreground text-sm text-center absolute bottom-0 left-0 text-muted-foreground">
      <p>
        &copy; {new Date().getFullYear()} Ryuu
        {" • "}
        <Link to="/privacy" className="transition-colors hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
