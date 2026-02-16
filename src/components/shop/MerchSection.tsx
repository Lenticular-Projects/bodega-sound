"use client";

import { motion } from "framer-motion";
import { ShoppingCartIcon, ArrowUpRightIcon } from "@/components/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { products } from "./shop-data";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

export function MerchSection() {
  return (
    <section id="shop" className="relative pt-8 pb-4 px-6">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bodega-yellow/5 rounded-full blur-[200px]" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <p className="text-bodega-yellow font-mono tracking-wider text-sm mb-2">
            OFFICIAL MERCHANDISE
          </p>
          <h2 className="font-display text-6xl md:text-8xl text-white tracking-tight mb-4">
            GEAR UP
          </h2>
          <p className="text-xl text-warm-400 max-w-xl">
            Represent the collective. Limited drops with each Contrabanda event.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-warm-800 text-white rounded-sm hover:bg-warm-700 transition-all duration-300"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            VIEW ALL MERCH
            <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
