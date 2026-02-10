"use client";

import { motion } from "framer-motion";
import { ShoppingCartIcon } from "@/components/icons";
import { fadeUp } from "@/lib/animations";
import { Product } from "./shop-data";

export function ProductCard({ product }: { product: Product }) {
    return (
        <motion.div variants={fadeUp} className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-warm-800 mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <a
                            href={product.orderLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-bodega-yellow text-[#0A0A08] font-bold rounded-sm hover:bg-bodega-yellow-light transition-colors duration-300"
                        >
                            <ShoppingCartIcon className="w-5 h-5" />
                            ADD TO CART
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-tight">
                        {product.name}
                    </h3>
                    <p className="text-warm-500 text-sm mt-1 line-clamp-1">
                        {product.description}
                    </p>
                </div>
                <span className="font-['Bebas_Neue'] text-2xl text-bodega-yellow">
                    {product.price}
                </span>
            </div>
        </motion.div>
    );
}
