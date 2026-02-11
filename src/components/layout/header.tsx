"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MenuIcon, CloseIcon } from "@/components/icons";

export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const menuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        },
        open: {
            opacity: 1,
            x: "0%",
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        }
    };

    const linkVariants = {
        closed: { y: 20, opacity: 0 },
        open: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.1 + i * 0.1,
                duration: 0.4,
                ease: "easeOut" as const
            }
        })
    };

    const navLinks = [
        { href: "/shop", label: "Shop" },
        { href: "/events", label: "Events" },
        { href: "/archive", label: "Archive" },
        { href: "/about", label: "About" },
        { href: "/links", label: "Links" },
    ];

    return (
        <>
            <AnimatePresence>
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex justify-between items-center transition-all duration-500 ${isVisible || isMenuOpen ? "bg-[#0A0A08]/80 backdrop-blur-md border-b border-zinc-800" : "bg-transparent"}`}
                >
                    <div className="flex items-center gap-8">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-zinc-100 hover:text-white transition-colors z-50 relative"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
                        </button>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/shop" className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest hidden md:block">
                                Shop
                            </Link>
                            <Link href="/about" className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest hidden md:block">
                                About
                            </Link>
                        </div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
                            <img
                                src="/images/logo/bdg-yellow.png"
                                alt="Bodega Sound"
                                className="h-8 md:h-10 w-auto object-contain transition-all"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/links" className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest hidden md:block">
                            Links
                        </Link>
                        <button className="bg-bodega-yellow text-black px-3 py-2 md:px-4 md:py-2 rounded-sm text-[10px] md:text-xs font-bold tracking-widest hover:scale-105 transition-transform whitespace-nowrap">
                            <span className="hidden md:inline">JOIN THE LIST</span>
                            <span className="md:hidden">JOIN</span>
                        </button>
                    </div>
                </motion.header>
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 bg-[#0A0A08] z-40 flex flex-col justify-center items-center md:hidden"
                    >
                        <nav className="flex flex-col items-center gap-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    custom={i}
                                    variants={linkVariants}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-3xl font-bold tracking-widest text-white hover:text-bodega-yellow transition-colors uppercase font-display"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        {/* Decorative background elements */}
                        <div className="absolute bottom-10 left-0 right-0 text-center opacity-20 pointer-events-none">
                            <img
                                src="/images/logo/bdg-yellow.png"
                                alt="Bodega Sound"
                                className="h-32 w-auto object-contain mx-auto grayscale opacity-10"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
