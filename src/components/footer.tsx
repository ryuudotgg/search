import { Link } from "@tanstack/react-router";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="text-muted-foreground w-full py-4 text-center font-mono text-xs tracking-[0.12em] uppercase">
      <p>
        &copy; {currentYear}{" "}
        <a
          href="https://ryuu.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Ryuu
        </a>
        {" · "}
        <Link to="/privacy" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
