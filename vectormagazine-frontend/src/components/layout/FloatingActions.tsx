"use client";
import { useEffect, useState } from "react";
import { ArrowUp, Facebook, Instagram, Twitter } from "lucide-react";

export default function FloatingActions() {
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (window.scrollY > 300) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };
        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Left: Scroll To Top */}
            <div
                className={`fixed left-8 bottom-8 z-40 transition-all duration-500 bg-white/0 flex flex-col items-center gap-4 ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="h-24 w-[1px] bg-gray-300 dark:bg-white/20"></div>
                <button
                    onClick={scrollToTop}
                    className="text-[10px] font-bold uppercase tracking-widest -rotate-90 whitespace-nowrap text-mow-dark dark:text-white hover:text-mow-primary transition-colors origin-center"
                >
                    Scroll to Top
                </button>
            </div>

            {/* Right: Social Follow */}
            <div className="fixed right-8 bottom-1/2 translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-6">
                <div className="flex flex-col gap-4 text-mow-dark dark:text-white">
                    <a href="#" className="hover:text-mow-primary transition-colors -rotate-90"><Facebook size={16} /></a>
                    <a href="#" className="hover:text-mow-primary transition-colors -rotate-90"><Twitter size={16} /></a>
                    <a href="#" className="hover:text-mow-primary transition-colors -rotate-90"><Instagram size={16} /></a>
                </div>
                <div className="h-16 w-[1px] bg-gray-300 dark:bg-white/20 my-2"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest -rotate-90 whitespace-nowrap text-mow-dark dark:text-white">Follow</span>
            </div>
        </>
    );
}
