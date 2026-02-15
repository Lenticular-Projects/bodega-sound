"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { products } from "@/components/shop/shop-data";
import { ProductCard } from "@/components/shop/ProductCard";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export function ShopPageContent() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUp}
                className="mb-16"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <p className="text-bodega-yellow font-mono tracking-wider text-sm mb-2">
                            OFFICIAL MERCHANDISE
                        </p>
                        <h1 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-zinc-900 dark:text-white tracking-tight transition-colors duration-300">
                            SHOP
                        </h1>
                    </div>
                    <p className="text-xl text-zinc-600 dark:text-warm-400 max-w-md pb-4 transition-colors duration-300">
                        Limited drops. Global shipping. Represent the collective wherever you are.
                    </p>
                </div>

                <div className="w-full h-px bg-zinc-200 dark:bg-warm-800 mb-16" />
            </motion.div>

            <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-24 pt-12 border-t border-zinc-200 dark:border-warm-800 text-center"
            >
                <p className="text-zinc-500 dark:text-warm-500 font-mono text-sm uppercase tracking-widest mb-4">
                    Restocks happen randomly
                </p>
                <p className="text-zinc-400 dark:text-warm-600 italic mb-8">
                    Join the newsletter to get notified before everyone else.
                </p>
                <div className="max-w-md mx-auto">
                    <NewsletterForm />
                </div>
            </motion.div>
        </div>
    );
}
