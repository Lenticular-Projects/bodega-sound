"use client";

import { useState, useTransition, useMemo } from "react";
import { format } from "date-fns";
import { updateOrderStatus, deleteOrder, exportOrdersCsv } from "@/server/actions/admin";
import toast from "react-hot-toast";

interface Order {
    id: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    contactNumber: string;
    shippingAddress: string;
    shippingMethod: string;
    productName: string;
    quantity: number;
    totalPrice: string;
    status: string;
    receiptUrl: string | null;
    notes: string | null;
}

const STATUSES = ["ALL", "PENDING", "VERIFIED", "SHIPPED", "DELIVERED"] as const;
const PAGE_SIZE = 20;

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    VERIFIED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SHIPPED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function OrdersTable({ orders }: { orders: Order[] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filtered = useMemo(() => {
        let result = orders;
        if (statusFilter !== "ALL") {
            result = result.filter((o) => o.status === statusFilter);
        }
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (o) =>
                    o.customerName.toLowerCase().includes(q) ||
                    o.customerEmail.toLowerCase().includes(q)
            );
        }
        return result;
    }, [orders, statusFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const handleStatusChange = (orderId: string, newStatus: string): void => {
        startTransition(async () => {
            const result = await updateOrderStatus(orderId, newStatus);
            if (!result.success) toast.error(result.error ?? "Failed.");
            else toast.success("Status updated.");
        });
    };

    const handleDelete = (orderId: string): void => {
        startTransition(async () => {
            const result = await deleteOrder(orderId);
            if (!result.success) toast.error(result.error ?? "Failed.");
            else toast.success("Order deleted.");
            setDeleteConfirm(null);
        });
    };

    const handleExport = async (): Promise<void> => {
        const csv = await exportOrdersCsv();
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-['Bebas_Neue'] tracking-tight text-white uppercase">Inbound Orders</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Transaction History & Receipts</p>
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
                <div className="flex gap-2">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setPage(0); }}
                            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all ${
                                statusFilter === s
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
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Product</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Receipt</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {paged.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">No orders found</td>
                            </tr>
                        ) : (
                            paged.map((order) => (
                                <tr key={order.id} className="hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-white font-medium">{format(new Date(order.createdAt), "MM/dd/yy")}</p>
                                        <p className="text-[10px] text-zinc-600 font-mono">{format(new Date(order.createdAt), "HH:mm")}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white font-bold uppercase tracking-tight">{order.customerName}</p>
                                        <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                                        <p className="text-[10px] text-zinc-600 mt-1">{order.contactNumber}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-bodega-yellow font-bold uppercase tracking-tight">{order.productName}</p>
                                        <p className="text-xs text-white">&#8369;{order.totalPrice}</p>
                                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">{order.shippingMethod}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={isPending}
                                            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border bg-transparent cursor-pointer outline-none ${statusColors[order.status] ?? "text-zinc-500 border-zinc-700"}`}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="VERIFIED">VERIFIED</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.receiptUrl ? (
                                            <a
                                                href={order.receiptUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest border border-zinc-700 transition-all rounded-sm"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-zinc-700 uppercase italic">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {deleteConfirm === order.id ? (
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleDelete(order.id)}
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
                                                onClick={() => setDeleteConfirm(order.id)}
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
