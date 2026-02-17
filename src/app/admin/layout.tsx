import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/server/db";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const pathname = headersList.get("x-nextjs-path") ?? "";
    const isLoginPage = pathname?.includes("/admin/login") || pathname === "/admin";

    // Login page gets a clean layout with no sidebar
    if (isLoginPage) {
        return <>{children}</>;
    }

    let unreadCount = 0;
    try {
        unreadCount = await prisma.contactMessage.count({ where: { read: false } });
    } catch {
        // Table may not exist yet in production
    }

    return (
        <div className="min-h-screen bg-[#0A0A08] text-zinc-100 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 flex flex-col pt-8">
                <div className="px-6 mb-12">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/logo/bdg-yellow.png"
                            alt="Bodega Sound"
                            width={192}
                            height={48}
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                    <p className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-[0.2em]">Internal Hub</p>
                </div>

<nav className="flex-1 px-4 space-y-1">
      <Link
        href="/admin/events"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-sm transition-all"
      >
        Events
      </Link>
      <Link
        href="/admin/orders"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-sm transition-all"
      >
        Orders
      </Link>
      <Link
        href="/admin/subscribers"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-sm transition-all"
      >
        Subscribers
      </Link>
      <Link
        href="/admin/messages"
        className="flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-sm transition-all"
      >
        <span>Messages</span>
        {unreadCount > 0 && (
          <span className="bg-bodega-yellow text-black text-[10px] font-bold px-2 py-0.5 rounded-sm min-w-[20px] text-center">
            {unreadCount}
          </span>
        )}
      </Link>
    </nav>

                <div className="p-4 border-t border-zinc-900">
                    <LogoutButton />
                    <p className="text-[10px] font-mono text-zinc-700 uppercase mt-4 px-4">Bodega Sound &copy; 2026</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-10 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
                    <h1 className="font-display text-2xl tracking-tight uppercase">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </header>
                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
