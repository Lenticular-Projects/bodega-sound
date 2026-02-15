import { prisma } from "@/server/db";
import { MessagesTable } from "@/components/admin/MessagesTable";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <MessagesTable messages={JSON.parse(JSON.stringify(messages))} />;
}
