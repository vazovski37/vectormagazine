export function LogoIcon({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="120" height="32" rx="16" fill="black" />
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="bold"
      >
        VECTOR
      </text>
    </svg>
  );
}

