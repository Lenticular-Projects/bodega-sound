"use server";

import { z } from "zod";
import { prisma } from "@/server/db";

const subscriberSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    phone: z.string().optional(),
});

export async function subscribeUser(formData: FormData) {
    try {
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
