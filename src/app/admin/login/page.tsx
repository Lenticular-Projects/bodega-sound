"use client";

import { useState } from "react";
import { loginAdmin } from "@/server/actions/auth";

export default function AdminLoginPage() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        try {
            const result = await loginAdmin(formData);
            // If we get a result back (not redirected), it means login failed
            if (result && !result.success) {
                setError(result.error ?? "Login failed.");
            }
        } catch {
            // redirect() throws NEXT_REDIRECT — this is expected on success
            // If it's a genuine error, the page would have redirected anyway
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A08] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <h1 className="font-display text-5xl text-white tracking-tight uppercase">
                        Admin
                    </h1>
                    <p className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-[0.2em]">
                        Bodega Sound Internal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            autoFocus
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-3 px-4 text-white placeholder:text-zinc-700 focus:border-bodega-yellow outline-none transition-colors"
                            placeholder="Enter admin password"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-mono">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-bodega-yellow text-black font-bold rounded-sm uppercase tracking-widest hover:bg-bodega-yellow-light transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Authenticating..." : "Enter"}
                    </button>
                </form>
            </div>
        </div>
    );
}
