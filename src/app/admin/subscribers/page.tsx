import { prisma } from "@/server/db";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
    const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-['Bebas_Neue'] tracking-tight text-white uppercase">Subscriber List</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Marketing & SMS Audience</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-sm text-zinc-400 font-mono text-xs">
                    Total Audience: {subscribers.length}
                </div>
            </div>

            <div className="overflow-x-auto bg-zinc-900/20 border border-zinc-800 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/40">
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Joined</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Source</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">No subscribers yet</td>
                            </tr>
                        ) : (
                            subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-white font-medium">{format(sub.createdAt, "MM/dd/yy")}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white font-bold uppercase tracking-tight">{sub.name || "—"}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-bodega-yellow font-medium">{sub.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-zinc-400 font-mono">{sub.phone || "—"}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-zinc-800 text-[10px] font-bold uppercase tracking-widest rounded-sm text-zinc-500 border border-zinc-700">
                                            {sub.source || "UNKNOWN"}
                                        </span>
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
