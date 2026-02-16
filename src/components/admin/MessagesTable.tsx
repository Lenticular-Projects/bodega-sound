"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { markMessageRead, deleteMessage } from "@/server/actions/admin";
import toast from "react-hot-toast";

interface ContactMessage {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
}

export function MessagesTable({ messages }: { messages: ContactMessage[] }) {
    const [isPending, startTransition] = useTransition();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const unreadCount = messages.filter((m) => !m.read).length;

    const handleMarkRead = (messageId: string): void => {
        startTransition(async () => {
            const result = await markMessageRead(messageId);
            if (!result.success) toast.error(result.error ?? "Failed.");
        });
    };

    const handleDelete = (messageId: string): void => {
        startTransition(async () => {
            const result = await deleteMessage(messageId);
            if (!result.success) toast.error(result.error ?? "Failed.");
            else toast.success("Message deleted.");
            setDeleteConfirm(null);
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-display tracking-tight text-white uppercase">Messages</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Contact Form Submissions</p>
                </div>
                <div className="flex items-center gap-4">
                    {unreadCount > 0 && (
                        <div className="bg-bodega-yellow/10 border border-bodega-yellow/20 px-4 py-2 rounded-sm text-bodega-yellow font-mono text-xs">
                            {unreadCount} unread
                        </div>
                    )}
                    <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-sm text-zinc-400 font-mono text-xs">
                        Total: {messages.length}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">
                        No messages yet
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-zinc-900/20 border rounded-sm transition-all ${
                                msg.read ? "border-zinc-800" : "border-bodega-yellow/30 bg-bodega-yellow/5"
                            }`}
                        >
                            <div
                                className="px-6 py-4 flex items-start justify-between cursor-pointer"
                                onClick={() => {
                                    setExpanded(expanded === msg.id ? null : msg.id);
                                    if (!msg.read) handleMarkRead(msg.id);
                                }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        {!msg.read && (
                                            <div className="w-2 h-2 rounded-full bg-bodega-yellow flex-shrink-0" />
                                        )}
                                        <p className="text-sm text-white font-bold uppercase tracking-tight">{msg.name}</p>
                                        <p className="text-xs text-zinc-500">{msg.email}</p>
                                        <p className="text-[10px] text-zinc-600 font-mono ml-auto flex-shrink-0">
                                            {format(new Date(msg.createdAt), "MM/dd/yy HH:mm")}
                                        </p>
                                    </div>
                                    <p className="text-xs text-zinc-400 truncate">{msg.message}</p>
                                </div>
                            </div>

                            {expanded === msg.id && (
                                <div className="px-6 pb-4 border-t border-zinc-800/50 pt-4">
                                    <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed mb-4">{msg.message}</p>
                                    <div className="flex items-center gap-4">
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your message to Bodega Sound`}
                                            className="px-4 py-2 bg-bodega-yellow text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-bodega-yellow-light transition-all"
                                        >
                                            Reply
                                        </a>
                                        {deleteConfirm === msg.id ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    disabled={isPending}
                                                    className="px-3 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-500 transition-all"
                                                >
                                                    Confirm Delete
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-3 py-2 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:text-white transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(msg.id)}
                                                className="px-3 py-2 text-zinc-600 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
