"use client";

import { motion } from "framer-motion";
import {
  InstagramIcon,
  YouTubeIcon,
  MusicIcon,
  ShoppingCartIcon,
  TicketIcon,
  EmailIcon,
} from "@/components/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";

const links = [
  {
    name: "NEXT EVENT: CONTRABANDA V",
    href: "/",
    icon: TicketIcon,
    primary: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/bodegasound",
    icon: InstagramIcon,
    primary: false,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@bodegasound",
    icon: YouTubeIcon,
    primary: false,
  },
  {
    name: "Spotify",
    href: "#",
    icon: MusicIcon,
    primary: false,
  },
  {
    name: "Merch Store",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSeDm_1NaY6prQv3Qe7KMbBLk7yxy9cJTqcILSdXeUfSw1Gqdg/viewform",
    icon: ShoppingCartIcon,
    primary: false,
  },
  {
    name: "Contact",
    href: "mailto:info@bodegasound.com",
    icon: EmailIcon,
    primary: false,
  },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#E5FF00] flex flex-col items-center justify-center p-6">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h1 className="font-['Bebas_Neue'] text-7xl text-[#0A0A08] tracking-tight">
            BODEGA
            <br />
            SOUND
          </h1>
          <p className="text-[#0A0A08]/60 font-mono text-sm mt-4">
            MANILA • QUARTERLY • UNDERGROUND
          </p>
        </motion.div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-3 w-full py-4 px-6 rounded-sm font-bold text-lg transition-all duration-300 ${
                link.primary
                  ? "bg-[#0A0A08] text-[#E5FF00] shadow-lg"
                  : "bg-[#0A0A08] text-[#E5FF00] hover:bg-[#1A1A18]"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          variants={fadeUp}
          className="text-center text-[#0A0A08]/40 text-sm mt-12 font-mono"
        >
          © 2025 Bodega Sound™
        </motion.p>
      </motion.div>
    </main>
  );
}
