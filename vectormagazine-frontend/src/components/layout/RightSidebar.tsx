"use client";

import Link from "next/link";
import { User, Search, Menu, ShoppingCart, Flame } from "lucide-react";
import { Button } from "../ui/button";

export default function RightSidebar() {
    return (
        <aside className="fixed right-8 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4 hidden lg:flex">

            {/* User / Sign In */}
            <Button
                variant="outline"
                size="icon"
                className="group w-12 h-12 cursor-pointer rounded-full shadow-lg border-border hover:bg-foreground hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                title="Sign In"
            >
                <User size={20} className="group-hover:text-primary-foreground transition-colors" />
            </Button>

            {/* Menu (Hamburger) */}
            <Button
                variant="outline"
                size="icon"
                className="group w-12 h-12 cursor-pointer rounded-full shadow-lg border-border hover:bg-foreground hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                title="Open Menu"
            >
                <Menu size={20} className="group-hover:text-primary-foreground transition-colors" />
            </Button>

            {/* Search */}
            <Button
                variant="outline"
                size="icon"
                className="group w-12 h-12 cursor-pointer rounded-full shadow-lg border-border hover:bg-foreground hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                title="Search"
            >
                <Search size={20} className="group-hover:text-primary-foreground transition-colors" />
            </Button>

            {/* Trending */}
            <Button
                variant="outline"
                size="icon"
                asChild
                className="group w-12 h-12 cursor-pointer rounded-full shadow-lg border-border hover:bg-foreground hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                title="Trending"
            >
                <Link href="#">
                    <Flame size={20} className="group-hover:text-primary-foreground transition-colors" />
                </Link>
            </Button>

            {/* Cart */}
            <Button
                variant="outline"
                size="icon"
                className="group relative w-12 h-12 cursor-pointer rounded-full shadow-lg border-border hover:bg-foreground hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                title="Cart"
            >
                <ShoppingCart size={20} className="group-hover:text-primary-foreground transition-colors" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-background pointer-events-none">
                    0
                </span>
            </Button>

        </aside>
    );
}
