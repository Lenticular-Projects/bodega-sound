import { prisma } from "@/server/db";
import { format } from "date-fns";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-['Bebas_Neue'] tracking-tight text-white uppercase">Inbound Orders</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Transaction History & Receipts</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-sm text-zinc-400 font-mono text-xs">
                    Total Volume: {orders.length}
                </div>
            </div>

            <div className="overflow-x-auto bg-zinc-900/20 border border-zinc-800 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/40">
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Product</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">No orders logged in system</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-white font-medium">{format(order.createdAt, "MM/dd/yy")}</p>
                                        <p className="text-[10px] text-zinc-600 font-mono">{format(order.createdAt, "HH:mm")}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white font-bold uppercase tracking-tight">{order.customerName}</p>
                                        <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                                        <p className="text-[10px] text-zinc-600 mt-1">{order.contactNumber}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-bodega-yellow font-bold uppercase tracking-tight">{order.productName}</p>
                                        <p className="text-xs text-white">₱{order.totalPrice}</p>
                                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">{order.shippingMethod}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                'bg-green-500/10 text-green-500 border border-green-500/20'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {order.receiptUrl ? (
                                            <a
                                                href={order.receiptUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest border border-zinc-700 transition-all rounded-sm"
                                            >
                                                View Proof
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-zinc-700 uppercase italic">No File</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
