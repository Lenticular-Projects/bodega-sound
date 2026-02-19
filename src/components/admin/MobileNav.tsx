"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  unreadCount: number;
}

const navItems = [
  { href: "/admin/events", label: "Events" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/messages", label: "Messages" },
];

export function MobileNav({ unreadCount }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-zinc-300 transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-zinc-300 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-zinc-300 transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile slide-out menu */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-warm-950 border-r border-zinc-900 z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-8">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-8">
            Internal Hub
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-sm transition-all ${
                    isActive
                      ? "text-bodega-yellow bg-zinc-900/50"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.label === "Messages" && unreadCount > 0 && (
                    <span className="bg-bodega-yellow text-black text-[10px] font-bold px-2 py-0.5 rounded-sm min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
