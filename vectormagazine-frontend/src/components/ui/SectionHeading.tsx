// src/components/ui/SectionHeading.tsx
import React from "react";

interface SectionHeadingProps {
  title: string;
  align?: "left" | "center";
  variant?: "scribble" | "slashed";
}

export default function SectionHeading({ title, align = "left", variant = "slashed" }: SectionHeadingProps) {

  if (variant === "scribble") {
    return (
      <div className={`relative py-12 ${align === "center" ? "text-center" : "text-left"}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 text-mow-primary opacity-40 z-0">
          {/* Simple zig-zag/scribble SVG */}
          <svg viewBox="0 0 200 20" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10 T120,10 T140,10 T160,10 T180,10 T200,10" />
          </svg>
        </div>
        <h2 className="relative z-10 text-5xl md:text-7xl font-black uppercase tracking-tighter text-mow-primary font-oswald mb-0 leading-none">
          {title}
        </h2>
      </div>
    );
  }

  // Default "slashed" style: // Title
  return (
    <div className={`flex items-center gap-2 mb-8 ${align === "center" ? "justify-center" : "justify-start"}`}>
      <span className="text-primary text-2xl font-black italic tracking-tighter">
        //
      </span>
      <h2 className="text-2xl font-bold font-oswald uppercase text-foreground">
        {title}
      </h2>
    </div>
  );
}