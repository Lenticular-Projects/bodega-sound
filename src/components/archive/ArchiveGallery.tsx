"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "@/components/icons";
import { LuminaInteractiveList, type LuminaSlide } from "@/components/ui/lumina-interactive-list";

interface ArchiveGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    slides: LuminaSlide[];
}

export function ArchiveGallery({ isOpen, onClose, slides }: ArchiveGalleryProps) {
    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 bg-black flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-[60] group flex items-center gap-2 text-white/70 hover:text-bodega-yellow transition-colors duration-300"
                        aria-label="Close gallery"
                    >
                        <span className="font-['Bebas_Neue'] text-xl tracking-wider hidden md:block">
                            CLOSE ARCHIVE
                        </span>
                        <div className="p-2 rounded-full border border-white/20 group-hover:border-bodega-yellow/50 transition-colors duration-300">
                            <CloseIcon className="w-6 h-6" />
                        </div>
                    </button>

                    {/* Gallery Component */}
                    <div className="flex-1 w-full h-full relative">
                        <LuminaInteractiveList
                            slides={slides}
                            mode="minimal"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
