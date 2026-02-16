"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 153;
const START_FRAME = 50;

export function SpinningLogo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);

    // Defer frame loading until after first paint so the hero renders instantly.
    // Frames load in the background and are ready before the user scrolls here.
    useEffect(() => {
        const startLoading = () => {
            const loadedImages: HTMLImageElement[] = [];
            let count = 0;

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, "0");
                img.src = `/images/logo/logo-spin-scroll/ezgif-frame-${frameNumber}.jpg`;
                img.onload = () => {
                    count++;
                    setLoadedCount(count);
                };
                loadedImages.push(img);
            }
            setImages(loadedImages);
        };

        // Wait for the browser to finish critical rendering before loading frames
        if (typeof window.requestIdleCallback === "function") {
            const id = window.requestIdleCallback(startLoading, { timeout: 2000 });
            return () => window.cancelIdleCallback(id);
        } else {
            const timer = setTimeout(startLoading, 200);
            return () => clearTimeout(timer);
        }
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Map scroll progress (0 to 1) to frame index (0 to 299)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [START_FRAME, FRAME_COUNT - 1]);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[Math.round(index)];
        if (!img) return;

        // Set canvas dimensions to match image if not set
        if (canvas.width !== img.width) canvas.width = img.width;
        if (canvas.height !== img.height) canvas.height = img.height;

        // Clear and draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        renderFrame(latest);
    });

    // Initial render when images are loaded
    useEffect(() => {
        if (loadedCount === FRAME_COUNT) {
            renderFrame(START_FRAME);
        }
    }, [loadedCount]);

    return (
        <div
            ref={containerRef}
            className="relative z-content h-[400vh] w-full"
        >
            <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain max-w-[90vw] max-h-[90vh]"
                />

                {loadedCount < FRAME_COUNT && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-mono text-xs">
                        LOADING ASSETS... {Math.round((loadedCount / FRAME_COUNT) * 100)}%
                    </div>
                )}
            </div>
        </div>
    );
}
