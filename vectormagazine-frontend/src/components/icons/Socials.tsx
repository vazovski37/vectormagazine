type IconProps = { className?: string };

export function XIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4l16 16M20 4l-6.5 6.5M10.5 13.5L4 20" />
    </svg>
  );
}

export function YouTubeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M21.6 7.2c-.2-1-1-1.8-2-2C17.4 4.8 12 4.8 12 4.8s-5.4 0-7.6.4c-1 .2-1.8 1-2 2C2 9.4 2 12 2 12s0 2.6.4 4.8c.2 1 1 1.8 2 2C6.6 19.2 12 19.2 12 19.2s5.4 0 7.6-.4c1-.2 1.8-1 2-2 .4-2.2.4-4.8.4-4.8s0-2.6-.4-4.8zM9.8 15.2V8.8l5.2 3.2-5.2 3.2z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

