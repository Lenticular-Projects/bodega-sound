"use server";

import { cookies } from "next/headers";
import { createHmac, randomBytes } from "crypto";
import { redirect } from "next/navigation";

const SECRET = process.env.ADMIN_PASSWORD ?? "";
const COOKIE_NAME = "admin-session";

function signToken(payload: string): string {
    return createHmac("sha256", SECRET).update(payload).digest("hex");
}

function createSessionToken(): string {
    const timestamp = Date.now().toString();
    const nonce = randomBytes(16).toString("hex");
    const payload = `${timestamp}:${nonce}`;
    const signature = signToken(payload);
    return `${payload}:${signature}`;
}

export async function loginAdmin(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const password = formData.get("password") as string;

    if (!SECRET) {
        return { success: false, error: "Admin password not configured." };
    }

    if (password !== SECRET) {
        return { success: false, error: "Invalid password." };
    }

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
    });

    redirect("/admin/orders");
}

export async function logoutAdmin(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    redirect("/admin/login");
}

export async function verifyAdminSession(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token || !SECRET) return false;

    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [, , signature] = parts;
    const expectedSignature = signToken(parts.slice(0, 2).join(":"));

    return signature === expectedSignature;
}
