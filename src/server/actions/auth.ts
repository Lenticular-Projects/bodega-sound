"use server";

import { cookies } from "next/headers";
import { createHmac, randomBytes } from "crypto";
import { redirect } from "next/navigation";

const ADMIN_SECRET = process.env.ADMIN_PASSWORD ?? "";
const DOOR_SECRET = process.env.DOOR_PASSWORD ?? "";
const ADMIN_COOKIE = "admin-session";
const DOOR_COOKIE = "door-session";

type Role = "admin" | "door";

function signToken(payload: string, secret: string): string {
    return createHmac("sha256", secret).update(payload).digest("hex");
}

function createSessionToken(secret: string): string {
    const timestamp = Date.now().toString();
    const nonce = randomBytes(16).toString("hex");
    const payload = `${timestamp}:${nonce}`;
    const signature = signToken(payload, secret);
    return `${payload}:${signature}`;
}

export async function loginAdmin(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const password = formData.get("password") as string;

    if (!ADMIN_SECRET) {
        return { success: false, error: "Admin password not configured." };
    }

    // Check admin password first, then door password
    let role: Role;
    let secret: string;
    let cookieName: string;

    if (password === ADMIN_SECRET) {
        role = "admin";
        secret = ADMIN_SECRET;
        cookieName = ADMIN_COOKIE;
    } else if (DOOR_SECRET && password === DOOR_SECRET) {
        role = "door";
        secret = DOOR_SECRET;
        cookieName = DOOR_COOKIE;
    } else {
        return { success: false, error: "Invalid password." };
    }

    const token = createSessionToken(secret);
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
    });

    if (role === "door") {
        redirect("/admin/door");
    }
    redirect("/admin/orders");
}

export async function logoutAdmin(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE);
    cookieStore.delete(DOOR_COOKIE);
    redirect("/admin/login");
}

export async function getSessionRole(): Promise<Role | null> {
    const cookieStore = await cookies();

    // Check admin session
    const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
    if (adminToken && ADMIN_SECRET) {
        const parts = adminToken.split(":");
        if (parts.length === 3) {
            const expectedSig = signToken(parts.slice(0, 2).join(":"), ADMIN_SECRET);
            if (parts[2] === expectedSig) return "admin";
        }
    }

    // Check door session
    const doorToken = cookieStore.get(DOOR_COOKIE)?.value;
    if (doorToken && DOOR_SECRET) {
        const parts = doorToken.split(":");
        if (parts.length === 3) {
            const expectedSig = signToken(parts.slice(0, 2).join(":"), DOOR_SECRET);
            if (parts[2] === expectedSig) return "door";
        }
    }

    return null;
}

export async function verifyAdminSession(): Promise<boolean> {
    const role = await getSessionRole();
    return role === "admin";
}
