"use client";

import { motion } from "framer-motion";
import { ShoppingCartIcon, ArrowUpRightIcon } from "@/components/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: "tshirt-black",
    name: "BODEGA T-SHIRT",
    price: "₱695",
    image: "/images/merch/tshirt-black.jpg",
    description:
      "Official Bodega Sound tee. 100% cotton. Black with yellow logo.",
  },
  {
    id: "hoodie-yellow",
    name: "CONTRABANDA HOODIE",
    price: "₱1,495",
    image: "/images/merch/hoodie.jpg",
    description: "Limited edition hoodie. Premium quality. Yellow on black.",
  },
  {
    id: "cap",
    name: "BODEGA CAP",
    price: "₱595",
    image: "/images/merch/cap.jpg",
    description: "Embroidered dad cap. Adjustable strap. Black.",
  },
  {
    id: "tote",
    name: "CARRYALL TOTE",
    price: "₱395",
    image: "/images/merch/tote.jpg",
    description: "Canvas tote bag. Perfect for records and essentials.",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div variants={fadeUp} className="group cursor-pointer">
      <div className="relative aspect-square rounded-sm overflow-hidden bg-warm-800 mb-4">
        {/* Placeholder gradient - yellow like the Bodega brand */}
        <div className="absolute inset-0 bg-[#E5FF00] flex items-center justify-center">
          <div className="text-center text-[#0A0A08]">
            <p className="font-['Bebas_Neue'] text-4xl">
              {product.name.split(" ")[0]}
            </p>
            <p className="text-sm opacity-60 mt-2">Image coming soon</p>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button className="flex items-center gap-2 px-6 py-3 bg-bodega-yellow text-[#0A0A08] font-bold rounded-sm hover:bg-bodega-yellow-light transition-colors duration-300">
              <ShoppingCartIcon className="w-5 h-5" />
              ADD TO CART
            </button>
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

export function MerchSection() {
  return (
    <section className="relative py-32 px-6">
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
          <h2 className="font-['Bebas_Neue'] text-6xl md:text-8xl text-white tracking-tight mb-4">
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
          {products.map((product) => (
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
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeDm_1NaY6prQv3Qe7KMbBLk7yxy9cJTqcILSdXeUfSw1Gqdg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-warm-800 text-white rounded-sm hover:bg-warm-700 transition-all duration-300"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            ORDER VIA GOOGLE FORM
            <ArrowUpRightIcon className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
