// ANIMATION CONFIG: "Languid & Expensive"
// Slow, smooth transitions with custom easing

export const transitions = {
    // The signature "Languid" ease - smooth start, very smooth end
    vibe: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },

    // For interactive elements that need feedback but shouldn't feel "jerky"
    interactive: { duration: 0.4, ease: "easeOut" },

    // Spring for things that physically move/scale
    spring: { type: "spring", stiffness: 100, damping: 20 }
};

export const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: transitions.vibe
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
};

export const scaleOnTap = {
    whileTap: { scale: 0.98 },
    whileHover: { scale: 1.01, y: -1 }, // Subtle float
    transition: transitions.interactive
};

export const breathe = {
    animate: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
        },
    },
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.12, // Slower stagger
            delayChildren: 0.1
        }
    }
};
