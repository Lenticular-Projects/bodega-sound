"use server";

import { z } from "zod";
import { prisma } from "@/server/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const orderSchema = z.object({
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    contactNumber: z.string().min(5),
    shippingAddress: z.string().min(10),
    shippingMethod: z.string(),
    productName: z.string(),
    quantity: z.number().min(1),
    totalPrice: z.string(),
});

export async function submitOrder(formData: FormData) {
    try {
        const rawData = {
            customerName: formData.get("name") as string,
            customerEmail: formData.get("email") as string,
            contactNumber: formData.get("phone") as string,
            shippingAddress: formData.get("address") as string,
            shippingMethod: formData.get("shipping") as string,
            productName: formData.get("productName") as string,
            quantity: parseInt(formData.get("quantity") as string || "1"),
            totalPrice: formData.get("totalPrice") as string,
        };

        const validatedData = orderSchema.parse(rawData);
        const proofFile = formData.get("proof") as File;

        if (!proofFile || proofFile.size === 0) {
            return { success: false, error: "Proof of payment is required." };
        }

        // 1. Save to Database
        const order = await prisma.order.create({
            data: validatedData,
        });

        // 2. Prepare file for Resend
        const arrayBuffer = await proofFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Send Email
        // Note: If RESEND_API_KEY is not set, this will fail. 
        // We check for the key to avoid throwing a hard error for the user if they haven't set it yet.
        if (process.env.RESEND_API_KEY) {
            const { data, error } = await resend.emails.send({
                from: "Bodega Sound Orders <onboarding@resend.dev>", // Default Resend test sender
                to: process.env.ADMIN_EMAIL || "orders@bodegasound.com",
                subject: `New Order: ${validatedData.productName} - ${validatedData.customerName}`,
                text: `
          New order received!
          
          Order ID: ${order.id}
          Customer: ${validatedData.customerName}
          Email: ${validatedData.customerEmail}
          Phone: ${validatedData.contactNumber}
          Address: ${validatedData.shippingAddress}
          
          Product: ${validatedData.productName}
          Quantity: ${validatedData.quantity}
          Total Price: ${validatedData.totalPrice}
          Shipping Method: ${validatedData.shippingMethod}
          
          Proof of payment is attached.
        `,
                attachments: [
                    {
                        filename: proofFile.name,
                        content: buffer,
                    },
                ],
            });

            if (error) {
                console.error("Resend error:", error);
                return { success: true, orderId: order.id, warning: "Order saved but notification email failed to send." };
            }
        } else {
            console.warn("RESEND_API_KEY not set. Email not sent.");
            return { success: true, orderId: order.id, warning: "Order saved locally, but email notification is not configured." };
        }

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Order submission error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: "Validation failed. Please check all fields." };
        }
        return { success: false, error: "Something went wrong. Please try again." };
    }
}
