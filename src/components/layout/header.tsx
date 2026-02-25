"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MenuIcon, CloseIcon, ArrowRightIcon } from "@/components/icons";
import { subscribeUser } from "@/server/actions/subscribers";
import toast from "react-hot-toast";
import { Dialog } from "@radix-ui/react-dialog";


export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Define pages that should have a static (always visible) header
    const isStaticPage = useMemo(() => {
        const staticPages = ["/events", "/paid", "/shop", "/about", "/contact"];
        return staticPages.includes(pathname);
    }, [pathname]);

    const [isVisible, setIsVisible] = useState(isStaticPage);

    // Update visibility when route changes
    useEffect(() => {
        setIsVisible(isStaticPage);
    }, [isStaticPage]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // If it's a static page, keep it visible regardless of scroll
        if (isStaticPage) {
            setIsVisible(true);
            return;
        }

        // Standard scroll behavior for home and archive
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
                    className={`fixed top-0 left-0 right-0 z-50 h-16 px-4 lg:h-28 lg:px-8 grid grid-cols-[1fr_auto_1fr] items-center ${isVisible || isMenuOpen ? "bg-white/70 dark:bg-black/60 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-white/10" : "bg-transparent pointer-events-none"}`}
                >
                    {/* Left: Nav */}
                    <div className="flex items-center">
                        <button
                            className="lg:hidden p-2.5 text-zinc-600 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors z-50 relative mr-4"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
                        </button>

                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm lg:text-base font-medium tracking-tight">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="hover:text-black dark:hover:text-bodega-yellow transition-colors text-zinc-600 dark:text-warm-300 uppercase whitespace-nowrap"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
                            <Image
                                src="/images/logo/bdg-yellow.png"
                                alt="Bodega Sound"
                                width={120}
                                height={60}
                                className="h-8 sm:h-10 lg:h-14 w-auto object-contain transition-all"
                            />
                        </Link>
                    </div>

                    {/* Right: CTA */}
                    <div className="flex items-center justify-end gap-4">
                        <SubscriberModal />
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
                        className="fixed inset-0 bg-warm-950 z-40 flex flex-col justify-center items-center lg:hidden"
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
                            <Image
                                src="/images/logo/bdg-yellow.png"
                                alt="Bodega Sound"
                                width={120}
                                height={120}
                                className="h-30 w-auto object-contain mx-auto grayscale opacity-10"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function SubscriberModal() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        data.append("email", email);

        try {
            const result = await subscribeUser(data);
            if (result.success) {
                toast.success("Welcome to the collective.");
                setOpen(false);
                setEmail("");
            } else {
                toast.error(result.error || "Failed to join.");
            }
        } catch {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <button
                onClick={() => setOpen(true)}
                className="bg-bodega-yellow text-black px-2.5 py-2 lg:px-4 lg:py-2.5 min-h-[44px] flex items-center rounded-sm text-[10px] sm:text-xs lg:text-sm font-bold tracking-widest hover:scale-105 transition-transform border border-transparent hover:border-black dark:hover:border-transparent whitespace-nowrap"
            >
                <span className="hidden sm:inline">JOIN THE LIST</span>
                <span className="sm:hidden">JOIN</span>
            </button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-warm-950 border border-zinc-800 p-8 rounded-sm shadow-2xl"
                        >
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
                            >
                                <CloseIcon size={20} />
                            </button>

                            <div className="text-center space-y-4">
                                <h3 className="font-display text-5xl text-white tracking-tight leading-none uppercase">Join the Collective</h3>
                                <p className="text-zinc-500 text-sm font-medium">Be the first to know about drops, secret parties, and archive updates.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-3 px-4 text-white placeholder:text-zinc-700 focus:border-bodega-yellow outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-bodega-yellow text-black font-bold flex items-center justify-center gap-2 hover:bg-bodega-yellow-light transition-all rounded-sm uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isSubmitting ? "Joining..." : "Submit"}
                                    {!isSubmitting && <ArrowRightIcon size={18} />}
                                </button>
                            </form>

                            <p className="text-[10px] text-zinc-700 text-center mt-6 font-mono uppercase tracking-widest">No SPAM. JUST THE DROPS.</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Dialog>
    );
}