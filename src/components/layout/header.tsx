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
        if (latest > 320) {
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
        { href: "/", label: "Home" },
        { href: "/events", label: "Events" },
        { href: "/archive", label: "Archive" },
        { href: "/shop", label: "Shop" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <>
            <AnimatePresence>
                <motion.header
                    initial={{ y: -40, opacity: 0 }}
                    animate={{
                        y: isVisible || isMenuOpen ? 0 : -40,
                        opacity: isVisible || isMenuOpen ? 1 : 0
                    }}
                    transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1] // Custom expo-out for smooth deceleration
                    }}
                    className={`fixed top-0 left-0 right-0 z-50 h-28 px-8 flex justify-between items-center ${isVisible || isMenuOpen ? "bg-white/70 dark:bg-black/60 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-white/10" : "bg-transparent pointer-events-none"}`}
                >
                    <div className="flex items-center">
                        {/* Mobile Menu Button - Hidden for now as user said forget mobile responsiveness, but kept for future use if needed */}
                        <button
                            className="md:hidden text-zinc-600 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors z-50 relative mr-4"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
                        </button>

                        <nav className="hidden md:flex items-center gap-10 text-xl font-medium tracking-tight ml-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300 uppercase"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
                            <img
                                src="/images/logo/bdg-yellow.png"
                                alt="Bodega Sound"
                                className="h-20 w-auto object-contain transition-all"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="bg-bodega-yellow text-black px-4 py-2 rounded-sm text-sm font-bold tracking-widest hover:scale-105 transition-transform border border-transparent hover:border-black dark:hover:border-transparent whitespace-nowrap">
                            JOIN THE LIST
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
                                className="h-30 w-auto object-contain mx-auto grayscale opacity-10"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}