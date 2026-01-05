export function Scribble({
  className = "h-6 w-24 text-neutral-300",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 28c40-20 70-18 108-6 38 12 61 14 84-12"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

