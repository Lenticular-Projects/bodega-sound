"use client";

import { logoutAdmin } from "@/server/actions/auth";

export function LogoutButton() {
    return (
        <form action={logoutAdmin}>
            <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-600 hover:text-red-400 hover:bg-zinc-900/50 rounded-sm transition-all text-left"
            >
                Logout
            </button>
        </form>
    );
}
