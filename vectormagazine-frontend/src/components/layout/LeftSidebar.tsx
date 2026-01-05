"use client";

import { useEffect, useMemo, useState } from "react";

export default function LeftSidebar() {
  const [showScroll, setShowScroll] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
      setShowScroll(scrollTop > 240);
      setProgress(Math.min(1, Math.max(0, ratio)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fillStyle = useMemo(
    () => ({
      height: `${Math.round(progress * 100)}%`,
    }),
    [progress],
  );

  return (
    <aside
      className={`fixed left-6 bottom-[80px] z-[60] hidden lg:flex flex-col cursor-pointer items-center gap-11 transition-all duration-500 ease-out mix-blend-difference ${
        showScroll
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="relative h-24 w-[2px] overflow-hidden rounded-full bg-white/40">
        <span
          className="absolute top-[0px] left-0 w-full bg-white transition-[height]"
          style={fillStyle}
        />
      </div>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="mt-3 origin-center cursor-pointer -rotate-90 whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.28em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-opacity duration-200"
      >
        Scroll to Top
      </button>
    </aside>
  );
}