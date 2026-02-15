import { prisma } from "@/server/db";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    let orders: unknown[] = [];
    try {
        orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch {
        // Database table may not exist yet
    }

    return <OrdersTable orders={JSON.parse(JSON.stringify(orders))} />;
}
