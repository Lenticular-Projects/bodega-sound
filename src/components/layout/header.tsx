"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-header backdrop-blur-md border-b border-zinc-200/50 dark:border-white/10 bg-white/80 dark:bg-black/50 transition-colors duration-300">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                    <img
                        src="/images/logo/bdg-yellow.png"
                        alt="Bodega Sound"
                        className="h-12 w-auto object-contain"
                    />
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-tight">
                    <Link href="/events" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">EVENTS</Link>
                    <Link href="/archive" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">ARCHIVE</Link>
                    <Link href="/shop" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">SHOP</Link>
                    <Link href="/about" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">ABOUT</Link>
                    <Link href="/contact" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">CONTACT</Link>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <button className="bg-bodega-yellow text-black px-4 py-2 rounded-sm text-xs font-bold tracking-widest hover:scale-105 transition-transform border border-transparent hover:border-black dark:hover:border-transparent">
                    JOIN THE LIST
                </button>
            </div>
        </header >
    );
}
