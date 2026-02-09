"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { MoonIcon, SunIcon, SystemIcon } from "@/components/icons";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-9 h-9" />;

    const cycleTheme = () => {
        if (theme === "system") setTheme("light");
        else if (theme === "light") setTheme("dark");
        else setTheme("system");
    };

    const Icon = theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : SystemIcon;

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={cycleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            aria-label="Toggle theme"
        >
            <Icon size={20} />
        </motion.button>
    );
}
