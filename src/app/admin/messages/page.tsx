import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/server/actions/auth";
import { prisma } from "@/server/db";
import { MessagesTable } from "@/components/admin/MessagesTable";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
    if (!(await verifyAdminSession())) redirect("/admin/login");
    let messages: unknown[] = [];
    try {
        messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch {
        // Database table may not exist yet
    }

    return <MessagesTable messages={JSON.parse(JSON.stringify(messages))} />;
}
