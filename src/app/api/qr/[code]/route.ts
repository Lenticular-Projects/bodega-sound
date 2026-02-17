import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import QRCode from "qrcode";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Find RSVP by QR code
    const rsvp = await prisma.rSVP.findUnique({
      where: { qrCode: code },
      include: { event: true },
    });

    if (!rsvp) {
      return new NextResponse("RSVP not found", { status: 404 });
    }

    // Generate QR code image
    const checkInUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/checkin?code=${code}`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(checkInUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // Convert data URL to buffer
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="qr-${code}.png"`,
      },
    });
  } catch (error) {
    console.error("QR code generation error:", error);
    return new NextResponse("Failed to generate QR code", { status: 500 });
  }
}
