import { prisma } from "@/server/db";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <OrdersTable orders={JSON.parse(JSON.stringify(orders))} />;
}
