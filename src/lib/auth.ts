const ADMIN_SECRET = process.env.ADMIN_PASSWORD ?? "";
const DOOR_SECRET = process.env.DOOR_PASSWORD ?? "";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export type AuthRole = "admin" | "door";

async function signToken(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
    if (!secret) return false;
    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [timestamp, nonce, signature] = parts;
    const payload = `${timestamp}:${nonce}`;
    const expected = await signToken(payload, secret);

    if (signature !== expected) return false;

    const age = Date.now() - parseInt(timestamp, 10);
    return age < TOKEN_EXPIRY_MS;
}

/** Verify admin session token (backwards compatible) */
export async function verifySessionToken(token: string): Promise<boolean> {
    return verifyToken(token, ADMIN_SECRET);
}

/** Verify door session token */
export async function verifyDoorSessionToken(token: string): Promise<boolean> {
    return verifyToken(token, DOOR_SECRET);
}
