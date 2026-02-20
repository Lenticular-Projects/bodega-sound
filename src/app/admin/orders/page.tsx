import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/server/actions/auth";
import { prisma } from "@/server/db";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    if (!(await verifyAdminSession())) redirect("/admin/login");
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
