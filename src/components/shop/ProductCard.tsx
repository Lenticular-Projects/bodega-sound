"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCartIcon } from "@/components/icons";
import { fadeUp } from "@/lib/animations";
import { Product } from "./shop-data";
import { BuyNowModal } from "./BuyNowModal";

export function ProductCard({ product }: { product: Product }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.div
                variants={fadeUp}
                className="group cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-warm-800 mb-4">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/40 transition-colors duration-300 flex items-end md:items-center justify-center p-4 md:p-0">
                        <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 transform md:translate-y-4 md:group-hover:translate-y-0 text-center">
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-bodega-yellow text-warm-950 font-bold rounded-sm hover:bg-bodega-yellow-light transition-colors duration-300 uppercase tracking-widest text-xs"
                            >
                                <ShoppingCartIcon className="w-5 h-5" />
                                BUY NOW
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-start px-1">
                    <div>
                        <h3 className="font-display text-3xl text-white tracking-tight leading-none">
                            {product.name}
                        </h3>
                        <p className="text-warm-500 text-xs uppercase font-bold tracking-widest mt-1 line-clamp-1">
                            {product.description}
                        </p>
                    </div>
                    <span className="font-display text-3xl text-bodega-yellow leading-none">
                        {product.price}
                    </span>
                </div>
            </motion.div>

            <BuyNowModal
                product={product}
                open={isOpen}
                onOpenChange={setIsOpen}
            />
        </>
    );
}
