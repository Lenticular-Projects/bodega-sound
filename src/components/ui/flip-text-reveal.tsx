"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipTextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    style?: React.CSSProperties;
}

/**
 * FlipTextReveal
 * A kinetic typography component that flips characters in 3D.
 * Designed for high-impact hero headers (e.g., "BODEGA SOUND").
 * 
 * Protocol: 
 * - Mobile First: Uses clamp() for font sizing.
 * - Accessibility: Uses aria-label for full text content.
 */
export function FlipTextReveal({ text, className, delay = 0, style }: FlipTextRevealProps) {
    const containerRef = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    // Split text into words, then words into characters to maintain spacing
    const words = text.split(" ");

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex flex-wrap justify-center font-display uppercase tracking-[-0.02em] leading-[0.8]",
                "text-[clamp(3.5rem,15vw,12rem)]",
                className
            )}
            style={style}
            aria-label={text}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-flex whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            initial={{ rotateX: -90, opacity: 0, y: 50 }}
                            animate={isInView ? { rotateX: 0, opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.8,
                                delay: delay + (wordIndex * 0.1) + (charIndex * 0.03),
                                ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier for aggressive "pop"
                            }}
                            className="inline-block origin-top"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </div>
    );
}
