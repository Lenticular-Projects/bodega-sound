import { z } from "zod";
import { prisma } from "@/server/db";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import { OrderEmail } from "@/emails/OrderConfirmation";

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

        // 1. Upload to Vercel Blob (if token exists)
        let receiptUrl = "";
        try {
            if (process.env.BLOB_READ_WRITE_TOKEN) {
                const blob = await put(`receipts/${Date.now()}-${proofFile.name}`, proofFile, {
                    access: "public",
                });
                receiptUrl = blob.url;
            } else {
                console.warn("BLOB_READ_WRITE_TOKEN not set. Skipping blob upload.");
            }
        } catch (blobError) {
            console.error("Blob upload error:", blobError);
            // We continue even if blob fails, as we still have the email attachment backup
        }

        // 2. Save to Database
        const order = await prisma.order.create({
            data: {
                ...validatedData,
                receiptUrl,
            },
        });

        // 3. Add to Subscribers list automatically
        try {
            await prisma.subscriber.upsert({
                where: { email: validatedData.customerEmail },
                update: {
                    name: validatedData.customerName,
                    phone: validatedData.contactNumber,
                },
                create: {
                    email: validatedData.customerEmail,
                    name: validatedData.customerName,
                    phone: validatedData.contactNumber,
                    source: "ORDER",
                },
            });
        } catch (subError) {
            console.error("Subscriber upsert error:", subError);
        }

        // 4. Send Email
        if (process.env.RESEND_API_KEY) {
            const arrayBuffer = await proofFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // A. Send confirmation to Customer
            await resend.emails.send({
                from: "Bodega Sound <onboarding@resend.dev>",
                to: validatedData.customerEmail,
                subject: `Order Secured: ${validatedData.productName}`,
                react: OrderEmail({
                    customerName: validatedData.customerName,
                    orderId: order.id.slice(-6).toUpperCase(),
                    productName: validatedData.productName,
                    totalPrice: validatedData.totalPrice,
                }),
            });

            // B. Send notification to Admin
            const { error: adminError } = await resend.emails.send({
                from: "Bodega Sound Orders <onboarding@resend.dev>",
                to: process.env.ADMIN_EMAIL || "orders@bodegasound.com",
                subject: `NEW ORDER: ${validatedData.productName} - ${validatedData.customerName}`,
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
          
          Receipt URL: ${receiptUrl || "Not uploaded to blob"}
          
          Proof of payment is attached.
        `,
                attachments: [
                    {
                        filename: proofFile.name,
                        content: buffer,
                    },
                ],
            });

            if (adminError) {
                console.error("Admin Resend error:", adminError);
                return { success: true, orderId: order.id, warning: "Order saved but admin notification failed." };
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

