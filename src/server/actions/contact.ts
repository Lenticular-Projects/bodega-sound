"use server";

import { z } from "zod";
import { prisma } from "@/server/db";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required").max(5000),
});

export async function submitContactMessage(
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    try {
        const data = contactSchema.parse({
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        });

        await prisma.contactMessage.create({ data });

        // Optional: Send notification email via Resend if configured
        if (process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import("resend");
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: "Bodega Sound <noreply@bodegasound.ph>",
                    to: "hello@bodegasound.ph",
                    subject: `New Contact: ${data.name}`,
                    text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
                });
            } catch {
                // Email notification is non-critical
            }
        }

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Contact form error:", error);
        return { success: false, error: "Failed to send message. Please try again." };
    }
}
