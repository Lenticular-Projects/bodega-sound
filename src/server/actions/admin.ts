"use server";

import { z } from "zod";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/server/actions/auth";

const orderStatusSchema = z.enum(["PENDING", "VERIFIED", "SHIPPED", "DELIVERED"]);

export async function updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
        await requireRole("admin");
        const validated = orderStatusSchema.parse(status);
        await prisma.order.update({
            where: { id: orderId },
            data: { status: validated },
        });
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, error: "Unauthorized" };
        }
        console.error("Update order status error:", error);
        return { success: false, error: "Failed to update order status." };
    }
}

export async function deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
        await requireRole("admin");
        await prisma.order.delete({ where: { id: orderId } });
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, error: "Unauthorized" };
        }
        console.error("Delete order error:", error);
        return { success: false, error: "Failed to delete order." };
    }
}

export async function deleteSubscriber(subscriberId: string): Promise<{ success: boolean; error?: string }> {
    try {
        await requireRole("admin");
        await prisma.subscriber.delete({ where: { id: subscriberId } });
        revalidatePath("/admin/subscribers");
        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, error: "Unauthorized" };
        }
        console.error("Delete subscriber error:", error);
        return { success: false, error: "Failed to delete subscriber." };
    }
}

export async function exportOrdersCsv(): Promise<{ success: boolean; csv?: string; error?: string }> {
    try {
        await requireRole("admin");
        const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
        const header = "ID,Date,Customer,Email,Contact,Product,Quantity,Total,Status,Shipping Method,Shipping Address";
        const rows = orders.map((o) =>
            [
                o.id,
                o.createdAt.toISOString(),
                `"${o.customerName.replace(/"/g, '""')}"`,
                o.customerEmail,
                o.contactNumber,
                `"${o.productName.replace(/"/g, '""')}"`,
                o.quantity,
                o.totalPrice,
                o.status,
                o.shippingMethod,
                `"${o.shippingAddress.replace(/"/g, '""')}"`,
            ].join(",")
        );
        return { success: true, csv: [header, ...rows].join("\n") };
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, error: "Unauthorized" };
        }
        console.error("Export orders error:", error);
        return { success: false, error: "Failed to export orders." };
    }
}

export async function exportSubscribersCsv(): Promise<{ success: boolean; csv?: string; error?: string }> {
    try {
        await requireRole("admin");
        const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
        const header = "ID,Date,Email,Name,Phone,Source";
        const rows = subscribers.map((s) =>
            [
                s.id,
                s.createdAt.toISOString(),
                s.email,
                s.name ?? "",
                s.phone ?? "",
                s.source ?? "",
            ].join(",")
        );
        return { success: true, csv: [header, ...rows].join("\n") };
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, error: "Unauthorized" };
        }
        console.error("Export subscribers error:", error);
        return { success: false, error: "Failed to export subscribers." };
    }
}

export async function markMessageRead(messageId: string): Promise<{ success: boolean; error?: string }> {
    try {
        await requireRole("admin");
        await prisma.contactMessage.update({
            where: { id: messageId },
            data: { read: true },
        });
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, error: "Unauthorized" };
        }
        console.error("Mark message read error:", error);
        return { success: false, error: "Failed to mark message as read." };
    }
}

export async function deleteMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
    try {
        await requireRole("admin");
        await prisma.contactMessage.delete({ where: { id: messageId } });
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return { success: false, error: "Unauthorized" };
        }
        console.error("Delete message error:", error);
        return { success: false, error: "Failed to delete message." };
    }
}
