"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/button";

const navLinks = [
    { href: "/", label: "Home & Demos" },
    { href: "#", label: "Features" },
    { href: "#", label: "Travel" },
    { href: "#", label: "Top Posts" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-background border-b border-border transition-colors duration-300">
                <div className="container mx-auto px-4">

                    {/* Top Row: Ticker | Logo | Actions */}
                    <div className="flex items-center justify-between h-20 border-b border-border">

                        {/* Left: Breaking News (Desktop Only) */}
                        <div className="hidden lg:flex items-center gap-4 w-1/3 overflow-hidden">
                            <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-primary">
                                Breaking
                            </span>
                            <div className="flex-grow overflow-hidden relative h-5">
                                <div className="absolute whitespace-nowrap animate-marquee flex gap-4">
                                    <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-foreground truncate">
                                        What High Performers Do Differently Before Breakfast
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Center: Logo */}
                        <div className="flex justify-center w-full lg:w-1/3">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="text-3xl font-bold font-oswald tracking-tighter text-foreground flex items-center gap-1">
                                    <span className="text-primary">●</span> VECTOR <span className="text-[10px] bg-foreground text-background px-1 py-0.5 rounded-sm ml-1 tracking-normal opacity-0 group-hover:opacity-100 transition-opacity">MAGAZINE</span>
                                </div>
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center justify-end gap-3 w-1/3 text-foreground">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden hover:text-primary"
                                onClick={toggleMobileMenu}
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Row: Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center justify-center h-12 gap-8 font-bold text-xs uppercase tracking-widest text-foreground/80">
                        {navLinks.map((link, index) => (
                            <div key={link.label} className="flex items-center gap-8">
                                <Link href={link.href} className="hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                                {index < navLinks.length - 1 && (
                                    <div className="w-[1px] h-3 bg-border"></div>
                                )}
                            </div>
                        ))}

                        {/* Search Icon in Nav */}
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                            <Search size={14} />
                        </Button>
                    </nav>

                </div>
                <style jsx>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-100%); }
                    }
                    .animate-marquee {
                        animation: marquee 15s linear infinite;
                    }
                `}</style>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeMobileMenu}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-background border-l border-border z-50 lg:hidden transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-border">
                    <span className="text-lg font-bold font-oswald tracking-tight text-foreground">
                        <span className="text-primary">●</span> Menu
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col p-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="py-4 text-base font-bold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors border-b border-border/50"
                            onClick={closeMobileMenu}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Search in Mobile */}
                    <button className="flex items-center gap-3 py-4 text-base font-bold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors">
                        <Search size={18} />
                        Search
                    </button>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                        © 2026 MOW Magazine
                    </p>
                </div>
            </div>
        </>
    );
}
