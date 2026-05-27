import { useTheme } from "~/components/theme-provider";

export function Npmx({ className }: { className?: string }) {
  const { theme } = useTheme();

  const tile = theme === "light" ? "#0a0a0a" : "#fafafa";
  const glyph = theme === "light" ? "#fafafa" : "#0a0a0a";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <title>npmx</title>
      <rect width="512" height="512" rx="64" fill={tile} />
      <rect x="110" y="310" width="60" height="60" fill="#525252" />
      <text
        x="320"
        y="370"
        fontFamily="'Geist Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
        fontSize="420"
        fontWeight="500"
        textAnchor="middle"
        fill={glyph}
      >
        /
      </text>
    </svg>
  );
}
