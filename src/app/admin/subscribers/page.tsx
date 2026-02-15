import { prisma } from "@/server/db";
import { SubscribersTable } from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
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
