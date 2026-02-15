const SECRET = process.env.ADMIN_PASSWORD ?? "";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

async function signToken(payload: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function verifySessionToken(token: string): Promise<boolean> {
    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [timestamp, nonce, signature] = parts;
    const payload = `${timestamp}:${nonce}`;
    const expected = await signToken(payload);

    if (signature !== expected) return false;

    const age = Date.now() - parseInt(timestamp, 10);
    return age < TOKEN_EXPIRY_MS;
}
