"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Twitter, Pin } from "lucide-react";

// 1. Icon Component
const SocialIconButton = ({ icon, label, href = "#" }: { icon: React.ReactNode, label: string, href?: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex items-center justify-center w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tooltip */}
            <div
                className={`absolute right-[140%] top-1/2 -translate-y-1/2 whitespace-nowrap bg-popover text-popover-foreground shadow-[0_2px_15px_rgba(0,0,0,0.1)] rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ease-out origin-right 
                ${isHovered ? 'opacity-100 visible translate-x-0 scale-100' : 'opacity-0 invisible translate-x-4 scale-90'}`}
            >
                {label}
            </div>

            {/* Icon */}
            <a
                href={href}
                className={`flex items-center justify-center text-foreground transition-all duration-300 ${isHovered ? 'text-primary scale-110' : ''}`}
            >
                {icon}
            </a>
        </div>
    );
};

export default function FloatingFollow() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (window.scrollY > 300) {
                setShow(true);
            } else {
                setShow(false);
            }
        };
        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    return (
        <div
            className={`fixed right-8 bottom-8 z-[60] hidden lg:flex flex-col items-center transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24 pointer-events-none'}`}
        >
            <div className="relative flex flex-col items-center">

                {/* --- 1. THE BLACK "TITLE" PILL --- */}
                <div className="z-20 bg-foreground text-background w-[50px] pt-6 pb-6 rounded-full flex items-center justify-center relative">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.15em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap select-none">
                        Follow
                    </span>
                </div>

                {/* --- 2. THE WHITE "LIST" PILL --- */}
                {/* Added 'border border-gray-200' here */}
                <div className="z-10 -mt-6 w-[50px] bg-card pt-10 pb-6 rounded-full flex flex-col gap-5 items-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-border">
                    <SocialIconButton icon={<Facebook size={16} strokeWidth={1.5} />} label="Facebook" />
                    <SocialIconButton icon={<Twitter size={16} strokeWidth={1.5} />} label="Twitter" />
                    <SocialIconButton icon={<Pin size={16} strokeWidth={1.5} />} label="Pinterest" />
                    <SocialIconButton icon={<Instagram size={16} strokeWidth={1.5} />} label="Instagram" />
                </div>

            </div>
        </div>
    );
}