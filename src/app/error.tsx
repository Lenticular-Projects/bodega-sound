"use client";

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <h1 className="font-display text-6xl text-zinc-900 dark:text-white tracking-tight mb-4">
                    SOMETHING BROKE
                </h1>
                <p className="text-zinc-600 dark:text-warm-400 text-lg mb-8">
                    An unexpected error occurred. Try refreshing the page.
                </p>
                <button
                    onClick={reset}
                    className="px-8 py-4 bg-bodega-yellow text-warm-950 font-bold rounded-sm hover:bg-bodega-yellow-light transition-all duration-300 uppercase tracking-widest"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
