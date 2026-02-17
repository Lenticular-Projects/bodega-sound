"use server";

import { z } from "zod";
import { prisma } from "@/server/db";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/rate-limit";

const subscribeLimiter = createRateLimiter("subscribe", 3, 15 * 60 * 1000);

const subscriberSchema = z.object({
    email: z.string().email().max(320),
    name: z.string().max(200).optional(),
    phone: z.string().max(30).optional(),
});

async function getClientIP(): Promise<string> {
    const hdrs = await headers();
    return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function subscribeUser(formData: FormData) {
    try {
        const ip = await getClientIP();
        const { allowed } = subscribeLimiter.check(ip);
        if (!allowed) {
            return { success: false, error: "Too many requests. Try again in 15 minutes." };
        }

        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;

        const validated = subscriberSchema.parse({ email, name, phone });

        await prisma.subscriber.upsert({
            where: { email: validated.email },
            update: {
                name: validated.name || undefined,
                phone: validated.phone || undefined,
            },
            create: {
                email: validated.email,
                name: validated.name,
                phone: validated.phone,
                source: "FOOTER",
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Subscription error:", error);
        return { success: false, error: "Failed to join. Please check your email format." };
    }
}
