"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-header backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-display tracking-tight hover:text-bodega-yellow transition-colors text-white">
                    BODEGA SOUND
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-tight">
                    <Link href="/archive" className="hover:text-bodega-yellow transition-colors text-warm-300">ARCHIVE</Link>
                    <Link href="/events" className="hover:text-bodega-yellow transition-colors text-warm-300">EVENTS</Link>
                    <Link href="/about" className="hover:text-bodega-yellow transition-colors text-warm-300">ABOUT</Link>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <button className="bg-bodega-yellow text-black px-4 py-2 rounded-sm text-xs font-bold tracking-widest hover:scale-105 transition-transform">
                    JOIN THE LIST
                </button>
            </div>
        </header>
    );
}
