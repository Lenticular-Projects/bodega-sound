import { prisma } from "@/server/db";
import { SubscribersTable } from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
    const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <SubscribersTable subscribers={JSON.parse(JSON.stringify(subscribers))} />;
}
