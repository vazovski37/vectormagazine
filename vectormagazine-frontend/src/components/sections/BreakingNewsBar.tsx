// src/components/sections/BreakingNewsBar.tsx
"use client";
import React from "react";
import Link from "next/link";
import Container from "../ui/Container";

export default function BreakingNewsBar() {
  return (
    <div className="bg-background border-b border-border py-4 overflow-hidden">
      <Container>
        <div className="flex items-center gap-6">

          {/* Static Label */}
          <span className="flex-shrink-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
            Breaking
          </span>

          {/* Marquee Content */}
          <div className="flex-grow overflow-hidden relative h-6 group cursor-pointer">
            {/* Note: A true infinite marquee usually requires JS or duplicate content.
               For simplicity, this is a sliding text animation.
            */}
            <div className="absolute whitespace-nowrap animate-marquee hover:pause-animation flex gap-8">
              <Link href="/post/1" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                What High Performers Do Differently Before Breakfast
              </Link>
              <span className="text-primary">•</span>
              <Link href="/post/2" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Creative Routines That Power the Most Productive Minds
              </Link>
              <span className="text-primary">•</span>
              <Link href="/post/3" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Declutter Your Digital Life in Under One Hour
              </Link>
            </div>
          </div>

        </div>
      </Container>

      {/* Add this to your globals.css for the animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .hover\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}