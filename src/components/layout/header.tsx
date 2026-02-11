"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-header backdrop-blur-md border-b border-zinc-200/50 dark:border-white/10 bg-white/80 dark:bg-black/50 transition-colors duration-300"
                >
                    {/* Left: Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-tight">
                        <Link href="/events" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">EVENTS</Link>
                        <Link href="/archive" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">ARCHIVE</Link>
                        <Link href="/shop" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">SHOP</Link>
                        <Link href="/about" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">ABOUT</Link>
                        <Link href="/contact" className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300">CONTACT</Link>
                    </nav>

                    {/* Center: Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link
                            href="/"
                            onClick={scrollToTop}
                            className="flex items-center hover:opacity-80 transition-opacity"
                        >
                            <img
                                src="/images/logo/bdg-yellow.png"
                                alt="Bodega Sound"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Right: CTA */}
                    <div className="flex items-center gap-4">
                        <button className="bg-bodega-yellow text-black px-4 py-2 rounded-sm text-xs font-bold tracking-widest hover:scale-105 transition-transform border border-transparent hover:border-black dark:hover:border-transparent">
                            JOIN THE LIST
                        </button>
                    </div>
                </motion.header >
            )}
        </AnimatePresence>
    );
}
