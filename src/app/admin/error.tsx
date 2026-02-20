"use client";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
                <h2 className="font-display text-5xl text-white tracking-tight mb-4">
                    SYSTEM ERROR
                </h2>
                <p className="text-zinc-500 text-sm mb-8">
                    An unexpected error occurred in the admin panel.
                    {error.digest && <span className="block font-mono text-xs mt-1 text-zinc-600">Reference: {error.digest}</span>}
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-bodega-yellow text-black font-bold rounded-sm hover:bg-bodega-yellow-light transition-all uppercase tracking-widest text-sm"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}
