import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/server/actions/auth";
import { prisma } from "@/server/db";
import { SubscribersTable } from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
    if (!(await verifyAdminSession())) redirect("/admin/login");
    let subscribers: unknown[] = [];
    try {
        subscribers = await prisma.subscriber.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch {
        // Database table may not exist yet
    }

    return <SubscribersTable subscribers={JSON.parse(JSON.stringify(subscribers))} />;
}
