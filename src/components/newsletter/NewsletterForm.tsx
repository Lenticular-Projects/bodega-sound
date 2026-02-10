"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SuccessIcon } from "@/components/icons";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call - would connect to actual backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);
        setIsSubmitted(true);
        setEmail("");
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-16 h-16 rounded-full bg-bodega-yellow/20 flex items-center justify-center">
                    <SuccessIcon className="w-8 h-8 text-bodega-yellow" />
                </div>
                <p className="text-bodega-yellow text-xl font-medium">
                    YOU&apos;RE IN. WELCOME TO THE COLLECTIVE.
                </p>
            </motion.div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto w-full"
        >
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 bg-transparent border-2 border-zinc-300 dark:border-warm-700 rounded-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-warm-600 focus:outline-none focus:border-bodega-yellow transition-colors duration-300"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-bodega-yellow text-[#0A0A08] font-bold rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
                {isLoading ? "..." : "SUBSCRIBE"}
            </button>
        </form>
    );
}
