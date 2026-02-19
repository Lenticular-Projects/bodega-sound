"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { submitContactMessage } from "@/server/actions/contact";
import toast from "react-hot-toast";

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        setIsLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("message", formData.message);

        const result = await submitContactMessage(data);

        setIsLoading(false);

        if (result.success) {
            setIsSubmitted(true);
            setFormData({ name: "", email: "", message: "" });
        } else {
            toast.error(result.error ?? "Something went wrong.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="w-full max-w-2xl mx-auto"
        >
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-mono tracking-widest text-zinc-500 dark:text-warm-500 uppercase">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-transparent border-2 border-zinc-300 dark:border-warm-800 rounded-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-warm-700 focus:outline-none focus:border-bodega-yellow transition-colors duration-300"
                            placeholder="YOUR NAME"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-mono tracking-widest text-zinc-500 dark:text-warm-500 uppercase">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-transparent border-2 border-zinc-300 dark:border-warm-800 rounded-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-warm-700 focus:outline-none focus:border-bodega-yellow transition-colors duration-300"
                            placeholder="YOUR@EMAIL.COM"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-mono tracking-widest text-zinc-500 dark:text-warm-500 uppercase">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full px-6 py-4 bg-transparent border-2 border-zinc-300 dark:border-warm-800 rounded-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-warm-700 focus:outline-none focus:border-bodega-yellow transition-colors duration-300 resize-none"
                            placeholder="TELL US WHAT'S ON YOUR MIND..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-8 py-4 bg-bodega-yellow text-warm-950 font-bold tracking-widest rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                    >
                        {isLoading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 text-center border border-zinc-200 dark:border-warm-800 bg-zinc-50/50 dark:bg-warm-900/20 rounded-sm"
                >
                    <h3 className="font-display text-4xl text-bodega-yellow mb-4">
                        MESSAGE RECEIVED
                    </h3>
                    <p className="text-zinc-600 dark:text-warm-400 text-lg">
                        We&apos;ll get back to you shortly. Stay tuned.
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-8 text-sm font-mono tracking-widest text-zinc-500 dark:text-warm-500 hover:text-zinc-900 dark:hover:text-bodega-yellow transition-colors underline"
                    >
                        SEND ANOTHER MESSAGE
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}
