"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TextRevealLine {
    text: string;
    href?: string;
}

interface TextRevealProps {
    text?: string;
    lines?: (string | TextRevealLine)[];
    className?: string;
    highlightWords?: string[];
}

/**
 * TextReveal
 * A scroll-triggered text reveal component where words highlight as you scroll.
 * Supports multi-line centered layouts with precise pinning behavior and line-specific links.
 */
export function TextReveal({ text, lines, className, highlightWords = [] }: TextRevealProps) {
    const targetRef = useRef<HTMLDivElement>(null);

    // Normalize lines to Line objects
    const content: TextRevealLine[] = lines
        ? lines.map(line => typeof line === "string" ? { text: line } : line)
        : (text ? [{ text }] : []);

    // Flatten words to calculate individual progress
    const allWords = content.flatMap((line, lineIndex) =>
        line.text.split(" ").map(word => ({ word, lineIndex }))
    );

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    // Dimming background to focus on text
    const bgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0]);

    return (
        <div ref={targetRef} className={cn("relative z-content min-h-[400vh]", className)}>
            {/* Dimming background */}
            <motion.div
                style={{ opacity: bgOpacity }}
                className="fixed inset-0 bg-white dark:bg-black pointer-events-none z-0"
            />

            <div className="sticky top-0 flex h-screen w-full items-center justify-center bg-transparent px-6 mx-auto z-10 text-center">
                <div className="flex flex-col gap-6 md:gap-10 w-full max-w-7xl">
                    {content.map((line, lineIdx) => {
                        // Find words belonging to this line
                        let wordOffset = 0;
                        for (let i = 0; i < lineIdx; i++) {
                            wordOffset += content[i].text.split(" ").length;
                        }
                        const lineWords = line.text.split(" ");
                        const href = line.href;

                        const renderWords = () => lineWords.map((word, i) => {
                            const globalIndex = wordOffset + i;
                            const start = globalIndex / allWords.length;
                            const end = (globalIndex + 1) / allWords.length;

                            // Check if word should be highlighted
                            // Remove punctuation for checking but keep it for rendering
                            const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                            const isHighlighted = highlightWords.some(hw =>
                                cleanWord.toLowerCase() === hw.toLowerCase()
                            );

                            return (
                                <Word
                                    key={i}
                                    range={[start, end]}
                                    progress={scrollYProgress}
                                    isHighlighted={isHighlighted}
                                >
                                    {word}
                                </Word>
                            );
                        });

                        const commonClassName = cn(
                            "flex flex-wrap justify-center font-display text-[clamp(1.5rem,5vw,4.5rem)] leading-[1.1] tracking-tight uppercase transition-colors text-zinc-900 dark:text-white",
                            href && "hover:text-bodega-yellow cursor-pointer underline decoration-bodega-yellow/30 underline-offset-8"
                        );

                        if (href) {
                            return (
                                <Link
                                    key={lineIdx}
                                    href={href}
                                    className={commonClassName}
                                    aria-label={line.text}
                                >
                                    {renderWords()}
                                </Link>
                            );
                        }

                        return (
                            <p
                                key={lineIdx}
                                className={commonClassName}
                                aria-label={line.text}
                            >
                                {renderWords()}
                            </p>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface WordProps {
    children: React.ReactNode;
    range: [number, number];
    progress: MotionValue<number>;
    isHighlighted?: boolean;
}

const Word = ({ children, range, progress, isHighlighted }: WordProps) => {
    // Smoother opacity transition
    const opacity = useTransform(progress, range, [0.1, 1]);
    // Subtle lift effect
    const y = useTransform(progress, range, ["10px", "0px"]);
    // Subtle blur effect
    const blurValue = useTransform(progress, range, [4, 0]);
    const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

    return (
        <span className="relative mr-[0.3em] mb-[0.2em] inline-block">
            <motion.span
                style={{ opacity, filter, y }}
                className={cn(
                    "inline-block transition-colors duration-300",
                    isHighlighted && "text-bodega-yellow drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-none"
                )}
            >
                {children}
            </motion.span>
        </span>
    );
};
