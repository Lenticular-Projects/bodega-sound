// ANIMATION CONFIG: "Languid & Expensive"
// Slow, smooth transitions with custom easing

// Easing curve constants — import these instead of inlining cubic-bezier values
export const EASING = {
    snapGlide: [0.76, 0, 0.24, 1] as const,     // fast snap, graceful settle
    entrance: [0.23, 1, 0.32, 1] as const,       // current vibe curve
    overshoot: [0.34, 1.56, 0.64, 1] as const,  // spring-like, for reveals
} as const;

// Delay constants — use these instead of hardcoded numbers
export const DELAY = {
    xs: 0.05,
    sm: 0.1,
    md: 0.2,
    lg: 0.3,
    xl: 0.5,
} as const;

export const transitions = {
    // The signature "Languid" ease - smooth start, very smooth end
    vibe: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },

    // For interactive elements that need feedback but shouldn't feel "jerky"
    // 300ms per spec
    interactive: { duration: 0.3, ease: "easeOut" },

    // Spring for things that physically move/scale
    spring: { type: "spring", stiffness: 100, damping: 20 }
};

export const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: transitions.vibe
};

// fadeUp with a 0.5s delay — use for secondary elements that follow primary entrance
export const fadeUpDelayed = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { ...transitions.vibe, delay: 0.5 }
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
};

// Slide up from below — for content reveals inside containers
export const slideUpIn = {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: { duration: 0.8, ease: EASING.entrance },
};

// Scale in from center — for icons, badges, success states
export const scaleIn = {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.5, ease: EASING.overshoot },
};

// Horizontal shake — for form validation errors
export const errorShake = {
    animate: {
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.5, ease: "easeInOut" as const },
    },
};

// Bounce scale — for success confirmations
export const successBounce = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: [0, 1.2, 0.95, 1],
        opacity: 1,
        transition: { duration: 0.6, ease: EASING.overshoot },
    },
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
            staggerChildren: 0.1, // 100ms per spec
            delayChildren: 0.1
        }
    }
};
