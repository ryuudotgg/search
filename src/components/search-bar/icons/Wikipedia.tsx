import { useTheme } from "src/components/theme-provider";

export function Wikipedia({ className }: { className?: string }) {
  const { theme } = useTheme();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
      <title>Wikipedia</title>
      <path
        d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M42,17.56 c0,0.18-0.18,0.35-0.36,0.35h-2.06l-9.21,18.92C30.28,36.91,30.19,37,30.01,37s-0.27-0.09-0.36-0.17l-4.38-8.54l-4.74,8.54 C20.44,36.91,20.35,37,20.17,37s-0.27-0.09-0.36-0.17L10.51,18H8.36C8.18,18,8,17.83,8,17.65v-1.3C8,16.17,8.18,16,8.36,16h7.28 c0.18,0,0.36,0.17,0.36,0.35v1.3c0,0.18-0.18,0.35-0.36,0.35h-1.38l6.45,14.12l3.4-6.1L19.81,18h-1.43c-0.18,0-0.36-0.17-0.36-0.35 v-1.3c0-0.18,0.18-0.35,0.36-0.35h6.26c0.18,0,0.36,0.17,0.36,0.35v1.3c0,0.18-0.18,0.35-0.36,0.35h-1.25l2.42,4.88L28.76,18h-1.4 C27.18,18,27,17.83,27,17.65v-1.3c0-0.18,0.18-0.35,0.36-0.35h5.28c0.18,0,0.36,0.17,0.36,0.35v1.3c0,0.18-0.18,0.35-0.36,0.35 h-1.38l-4.29,7.15l3.49,6.97L37.17,18h-1.81C35.18,18,35,17.83,35,17.65v-1.3c0-0.18,0.18-0.35,0.36-0.35h6.28 c0.18,0,0.36,0.17,0.36,0.35V17.56z"
        fill={theme === "light" ? "#24292f" : "#ffffff"}
      />
    </svg>
  );
}
