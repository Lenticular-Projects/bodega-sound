"use client";

import { useState, useTransition, useMemo } from "react";
import { format } from "date-fns";
import { deleteSubscriber, exportSubscribersCsv } from "@/server/actions/admin";
import toast from "react-hot-toast";

interface Subscriber {
    id: string;
    createdAt: string;
    email: string;
    name: string | null;
    phone: string | null;
    source: string | null;
}

const PAGE_SIZE = 20;

export function SubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
    const [search, setSearch] = useState("");
    const [sourceFilter, setSourceFilter] = useState("ALL");
    const [page, setPage] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const sources = useMemo(() => {
        const set = new Set(subscribers.map((s) => s.source ?? "UNKNOWN"));
        return ["ALL", ...Array.from(set).sort()];
    }, [subscribers]);

    const filtered = useMemo(() => {
        let result = subscribers;
        if (sourceFilter !== "ALL") {
            result = result.filter((s) => (s.source ?? "UNKNOWN") === sourceFilter);
        }
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (s) =>
                    s.email.toLowerCase().includes(q) ||
                    (s.name?.toLowerCase().includes(q) ?? false)
            );
        }
        return result;
    }, [subscribers, sourceFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const handleDelete = (subscriberId: string): void => {
        startTransition(async () => {
            const result = await deleteSubscriber(subscriberId);
            if (!result.success) toast.error(result.error ?? "Failed.");
            else toast.success("Subscriber removed.");
            setDeleteConfirm(null);
        });
    };

    const handleExport = async (): Promise<void> => {
        const result = await exportSubscribersCsv();
        if (!result.success || !result.csv) {
            toast.error(result.error || "Failed to export subscribers");
            return;
        }
        const blob = new Blob([result.csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-display tracking-tight text-white uppercase">Subscriber List</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Marketing & SMS Audience</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest border border-zinc-700 rounded-sm transition-all"
                    >
                        Export CSV
                    </button>
                    <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-sm text-zinc-400 font-mono text-xs">
                        Total: {filtered.length}
                    </div>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    placeholder="Search by name or email..."
                    className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 px-4 text-white placeholder:text-zinc-700 focus:border-bodega-yellow outline-none transition-colors text-sm"
                />
                <div className="flex gap-2 flex-wrap">
                    {sources.map((s) => (
                        <button
                            key={s}
                            onClick={() => { setSourceFilter(s); setPage(0); }}
                            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all ${
                                sourceFilter === s
                                    ? "bg-bodega-yellow text-black border-bodega-yellow"
                                    : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:text-white"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-zinc-900/20 border border-zinc-800 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/40">
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Joined</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Source</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {paged.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">No subscribers found</td>
                            </tr>
                        ) : (
                            paged.map((sub) => (
                                <tr key={sub.id} className="hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-white font-medium">{format(new Date(sub.createdAt), "MM/dd/yy")}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white font-bold uppercase tracking-tight">{sub.name || "\u2014"}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-bodega-yellow font-medium">{sub.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-zinc-400 font-mono">{sub.phone || "\u2014"}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-zinc-800 text-[10px] font-bold uppercase tracking-widest rounded-sm text-zinc-500 border border-zinc-700">
                                            {sub.source || "UNKNOWN"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {deleteConfirm === sub.id ? (
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleDelete(sub.id)}
                                                    disabled={isPending}
                                                    className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-500 transition-all"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:text-white transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(sub.id)}
                                                className="px-3 py-1 text-zinc-600 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
                    >
                        Prev
                    </button>
                    <span className="text-zinc-600 font-mono text-xs">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
