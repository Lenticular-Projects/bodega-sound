"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SuccessIcon } from "@/components/icons";
import { subscribeUser } from "@/server/actions/subscribers";
import toast from "react-hot-toast";
import { successBounce, errorShake } from "@/lib/animations";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validate = (value: string): string => {
        if (!value) return "Email is required.";
        if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address.";
        return "";
    };

    const handleBlur = () => {
        setEmailError(validate(email));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) setEmailError(validate(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validate(email);
        if (error) {
            setEmailError(error);
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("email", email);

        const result = await subscribeUser(data);

        setIsLoading(false);

        if (result.success) {
            setIsSubmitted(true);
            setEmail("");
        } else {
            toast.error(result.error ?? "Something went wrong.");
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={successBounce.initial}
                animate={successBounce.animate}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-16 h-16 rounded-sm bg-bodega-yellow/20 flex items-center justify-center">
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
            noValidate
            className="flex flex-col gap-2 max-w-lg mx-auto w-full"
        >
            <div className="flex flex-col md:flex-row gap-4">
                <motion.div
                    animate={emailError ? errorShake.animate : {}}
                    className="flex-1"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        aria-label="Email address"
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? "newsletter-error" : undefined}
                        className={cn(
                            "w-full px-6 py-4 bg-transparent border-2 rounded-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-warm-600 focus:outline-none transition-colors duration-300",
                            emailError
                                ? "border-red-500 focus:border-red-500"
                                : "border-zinc-300 dark:border-warm-700 focus:border-bodega-yellow"
                        )}
                    />
                </motion.div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-bodega-yellow text-warm-950 font-bold rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2 min-w-[140px]"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isLoading ? (
                            <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="inline-block w-4 h-4 border-2 border-warm-950/30 border-t-warm-950 rounded-full animate-spin"
                            />
                        ) : (
                            <motion.span
                                key="label"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                SUBSCRIBE
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {emailError && (
                <p id="newsletter-error" role="alert" className="text-xs text-red-400 mt-1 text-left px-1">
                    {emailError}
                </p>
            )}
        </form>
    );
}
