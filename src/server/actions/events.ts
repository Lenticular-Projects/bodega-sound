"use server";

import { z } from "zod";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { requireRole } from "@/server/actions/auth";
import { createRateLimiter } from "@/lib/rate-limit";

const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
};

const rsvpLimiter = createRateLimiter("rsvp", 5, 15 * 60 * 1000);

// Event Schema
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  eventDate: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  locationUrl: z.string().optional(),
  flyerImage: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  ticketPrice: z.string().optional(),
  currency: z.string().default("PHP"),
  collectInstagram: z.boolean().default(false),
  collectPhone: z.boolean().default(false),
  allowPlusOnes: z.boolean().default(false),
  showGuestList: z.boolean().default(false),
});

// RSVP Schema
const rsvpSchema = z.object({
  eventId: z.string(),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email required").max(320),
  phone: z.string().max(30).optional(),
  instagram: z.string().max(100).optional(),
  status: z.enum(["GOING", "MAYBE", "NOT_GOING"]),
  plusOnes: z.coerce.number().int().min(0).max(10).default(0),
  plusOneNames: z.string().max(500).optional(),
  referralSource: z.string().max(100).default("DIRECT"),
});

// Manual Add Guest Schema
const manualAddGuestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email required").max(320),
  phone: z.string().max(30).optional(),
  instagram: z.string().max(100).optional(),
  status: z.enum(["GOING", "MAYBE", "NOT_GOING"]).default("GOING"),
  plusOnes: z.coerce.number().int().min(0).max(10).default(0),
  plusOneNames: z.string().max(500).optional(),
});

// Generate cryptographically secure QR code
function generateQRCode(): string {
  return randomUUID();
}

// Generate a URL-friendly slug from a title
async function generateSlug(title: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    || `event-${Math.random().toString(36).substring(2, 8)}`;

  // Check if slug already exists, append random suffix if so
  const existing = await prisma.event.findUnique({ where: { slug: base } });
  if (!existing) return base;

  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

async function getClientIP(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// Create Event
export async function createEvent(formData: FormData) {
  try {
    await requireRole("admin");

    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      eventDate: formData.get("eventDate") as string,
      location: formData.get("location") as string,
      locationUrl: formData.get("locationUrl") as string,
      flyerImage: formData.get("flyerImage") as string,
      capacity: formData.get("capacity") as string,
      ticketPrice: formData.get("ticketPrice") as string,
      currency: formData.get("currency") as string,
      collectInstagram: formData.get("collectInstagram") === "on",
      collectPhone: formData.get("collectPhone") === "on",
      allowPlusOnes: formData.get("allowPlusOnes") === "on",
      showGuestList: formData.get("showGuestList") === "on",
    };

    const validatedData = eventSchema.parse({
      ...rawData,
      capacity: rawData.capacity ? parseInt(rawData.capacity) : undefined,
    });

    const slug = await generateSlug(validatedData.title);
    const event = await prisma.event.create({
      data: {
        ...validatedData,
        slug,
        eventDate: new Date(validatedData.eventDate),
        status: "PUBLISHED",
      },
    });

    revalidatePath("/admin/events");
    return { success: true, eventId: event.id, slug: event.slug };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Create event error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    const message = error instanceof Error ? error.message : "Failed to create event";
    return { success: false, error: process.env.NODE_ENV === "development" ? message : "Failed to create event" };
  }
}

// Update Event
export async function updateEvent(eventId: string, formData: FormData) {
  try {
    await requireRole("admin");

    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      eventDate: formData.get("eventDate") as string,
      location: formData.get("location") as string,
      locationUrl: formData.get("locationUrl") as string,
      flyerImage: formData.get("flyerImage") as string,
      capacity: formData.get("capacity") as string,
      ticketPrice: formData.get("ticketPrice") as string,
      currency: formData.get("currency") as string,
      collectInstagram: formData.get("collectInstagram") === "on",
      collectPhone: formData.get("collectPhone") === "on",
      allowPlusOnes: formData.get("allowPlusOnes") === "on",
      showGuestList: formData.get("showGuestList") === "on",
    };

    const validatedData = eventSchema.parse({
      ...rawData,
      capacity: rawData.capacity ? parseInt(rawData.capacity) : undefined,
    });

    await prisma.event.update({
      where: { id: eventId },
      data: {
        ...validatedData,
        eventDate: new Date(validatedData.eventDate),
      },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${eventId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Update event error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update event" };
  }
}

// Delete Event
export async function deleteEvent(eventId: string) {
  try {
    await requireRole("admin");
    await prisma.event.delete({ where: { id: eventId } });
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Delete event error:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

// Submit RSVP (public — rate limited)
export async function submitRSVP(formData: FormData) {
  try {
    const ip = await getClientIP();
    const { allowed } = rsvpLimiter.check(ip);
    if (!allowed) {
      return { success: false, error: "Too many submissions. Try again in 15 minutes." };
    }

    const str = (key: string): string => (formData.get(key) as string) || "";
    const optStr = (key: string): string | undefined => {
      const val = formData.get(key);
      return val && typeof val === "string" && val.trim() ? val.trim() : undefined;
    };

    const validatedData = rsvpSchema.parse({
      eventId: str("eventId"),
      name: str("name"),
      email: str("email"),
      phone: optStr("phone"),
      instagram: optStr("instagram"),
      status: str("status"),
      plusOnes: parseInt(str("plusOnes") || "0") || 0,
      plusOneNames: optStr("plusOneNames"),
      referralSource: optStr("referralSource") || "DIRECT",
    });

    // Check if event exists and is published
    const event = await prisma.event.findFirst({
      where: { id: validatedData.eventId, status: "PUBLISHED" },
    });

    if (!event) {
      return { success: false, error: "Event not found or not available" };
    }

    // Check capacity if set (count total headcount including plus-ones)
    if (event.capacity) {
      const currentRSVPs = await prisma.rSVP.findMany({
        where: { eventId: event.id, status: { in: ["GOING", "MAYBE"] } },
        select: { plusOnes: true },
      });
      const currentHeadcount = currentRSVPs.reduce((sum, r) => sum + 1 + r.plusOnes, 0);
      const incomingHeadcount = 1 + (validatedData.plusOnes || 0);

      if (currentHeadcount + incomingHeadcount > event.capacity && validatedData.status === "GOING") {
        return { success: false, error: "Event is at capacity" };
      }
    }

    // Check for existing RSVP
    const existingRSVP = await prisma.rSVP.findFirst({
      where: { eventId: validatedData.eventId, email: validatedData.email },
    });

    if (existingRSVP) {
      // Update existing RSVP
      const updated = await prisma.rSVP.update({
        where: { id: existingRSVP.id },
        data: {
          ...validatedData,
          plusOnes: validatedData.plusOnes || 0,
        },
      });

      revalidatePath(`/events/${event.id}`);
      return { success: true, rsvpId: updated.id, qrCode: updated.qrCode, isUpdate: true };
    }

    // Create new RSVP with QR code
    const qrCode = generateQRCode();
    const rsvp = await prisma.rSVP.create({
      data: {
        ...validatedData,
        plusOnes: validatedData.plusOnes || 0,
        qrCode,
      },
    });

    // Send confirmation email if Resend is configured
    const resend = getResend();
    if (resend) {
      try {
        await resend.emails.send({
          from: "Bodega Sound <hello@bodegasound.com>",
          to: validatedData.email,
          subject: `You're on the list! ${event.title}`,
          text: `Hi ${validatedData.name},\n\nYou're confirmed for ${event.title}!\n\n📅 ${new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}\n📍 ${event.location}\n\nYour QR code for check-in:\nhttps://bodegasound.com/api/qr/${rsvp.qrCode}\n\nSee you on the dance floor!\n\n— The Bodega Sound Team`,
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Don't fail if email doesn't send
      }
    }

    revalidatePath(`/events/${event.id}`);
    return { success: true, rsvpId: rsvp.id, qrCode: rsvp.qrCode, isUpdate: false };
  } catch (error) {
    console.error("RSVP error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to submit RSVP" };
  }
}

// Get Event by ID (public)
export async function getEvent(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { rsvps: { where: { status: { in: ["GOING", "MAYBE"] } } } },
        },
      },
    });

    if (!event) return null;

    return {
      ...event,
      rsvpCount: event._count.rsvps,
    };
  } catch (error) {
    console.error("Get event error:", error);
    return null;
  }
}

// Get Event by slug or ID (public — tries slug first, falls back to ID)
export async function getEventBySlugOrId(slugOrId: string) {
  try {
    // Try slug first
    let event = await prisma.event.findUnique({
      where: { slug: slugOrId },
      include: {
        _count: {
          select: { rsvps: { where: { status: { in: ["GOING", "MAYBE"] } } } },
        },
      },
    });

    // Fall back to ID lookup
    if (!event) {
      event = await prisma.event.findUnique({
        where: { id: slugOrId },
        include: {
          _count: {
            select: { rsvps: { where: { status: { in: ["GOING", "MAYBE"] } } } },
          },
        },
      });
    }

    if (!event) return null;

    return {
      ...event,
      rsvpCount: event._count.rsvps,
    };
  } catch (error) {
    console.error("Get event by slug/id error:", error);
    return null;
  }
}

// Get All Events (public — used by main page too)
export async function getAllEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "desc" },
      include: {
        rsvps: {
          where: { status: { in: ["GOING", "MAYBE"] } },
          select: { plusOnes: true },
        },
      },
    });

    return events.map(event => ({
      ...event,
      rsvpCount: event.rsvps.reduce((sum, r) => sum + 1 + r.plusOnes, 0),
    }));
  } catch (error) {
    console.error("Get events error:", error);
    return [];
  }
}

// Get Event RSVPs (Admin/Door)
export async function getEventRSVPs(eventId: string) {
  try {
    await requireRole("admin", "door");

    const rsvps = await prisma.rSVP.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    return rsvps;
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return [];
    }
    console.error("Get RSVPs error:", error);
    return [];
  }
}

// Check In Guest (Admin/Door)
export async function checkInGuest(rsvpId: string, checkedInBy?: string) {
  try {
    await requireRole("admin", "door");

    const rsvp = await prisma.rSVP.update({
      where: { id: rsvpId },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
        checkedInBy: checkedInBy || null,
      },
    });

    return { success: true, rsvp };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Check-in error:", error);
    return { success: false, error: "Failed to check in guest" };
  }
}

// Undo Check In (Admin/Door)
export async function undoCheckIn(rsvpId: string) {
  try {
    await requireRole("admin", "door");

    const rsvp = await prisma.rSVP.update({
      where: { id: rsvpId },
      data: {
        checkedIn: false,
        checkedInAt: null,
        checkedInBy: null,
      },
    });

    return { success: true, rsvp };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Undo check-in error:", error);
    return { success: false, error: "Failed to undo check-in" };
  }
}

// Manual Add Guest (Admin)
export async function manualAddGuest(eventId: string, formData: FormData) {
  try {
    await requireRole("admin");

    const parsed = manualAddGuestSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      instagram: formData.get("instagram") || undefined,
      status: formData.get("status") || "GOING",
      plusOnes: formData.get("plusOnes"),
      plusOneNames: formData.get("plusOneNames") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const { name, email, phone, instagram, status, plusOnes, plusOneNames } = parsed.data;

    const qrCode = generateQRCode();
    const rsvp = await prisma.rSVP.create({
      data: {
        eventId,
        name,
        email,
        phone,
        instagram,
        status,
        plusOnes,
        plusOneNames,
        referralSource: "MANUAL_ADD",
        qrCode,
      },
    });

    revalidatePath(`/admin/events/${eventId}`);
    return { success: true, rsvpId: rsvp.id };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Manual add error:", error);
    return { success: false, error: "Failed to add guest" };
  }
}

// Check In by QR Code (Admin/Door)
export async function checkInByQRCode(qrCode: string): Promise<{
  success: boolean;
  guestName?: string;
  eventId?: string;
  eventSlug?: string;
  error?: string;
}> {
  try {
    await requireRole("admin", "door");

    const rsvp = await prisma.rSVP.findUnique({
      where: { qrCode },
      include: { event: true },
    });

    if (!rsvp) {
      return { success: false, error: "QR code not found" };
    }

    if (rsvp.checkedIn) {
      return {
        success: false,
        error: `${rsvp.name} is already checked in`,
        guestName: rsvp.name,
        eventId: rsvp.eventId,
        eventSlug: rsvp.event.slug,
      };
    }

    await prisma.rSVP.update({
      where: { id: rsvp.id },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
        checkedInBy: "QR_SCAN",
      },
    });

    return {
      success: true,
      guestName: rsvp.name,
      eventId: rsvp.eventId,
      eventSlug: rsvp.event.slug,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("QR check-in error:", error);
    return { success: false, error: "Failed to process check-in" };
  }
}

// Delete RSVP (Admin)
export async function deleteRSVP(rsvpId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireRole("admin");
    await prisma.rSVP.delete({ where: { id: rsvpId } });
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Delete RSVP error:", error);
    return { success: false, error: "Failed to delete guest" };
  }
}

// Export RSVPs to CSV (Admin)
export async function exportRSVPsToCSV(eventId: string) {
  try {
    await requireRole("admin");

    const rsvps = await prisma.rSVP.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    const csvHeaders = [
      "Name",
      "Email",
      "Phone",
      "Instagram",
      "Status",
      "Plus Ones",
      "Plus One Names",
      "Referral Source",
      "Checked In",
      "Checked In At",
      "Registration Date",
    ];

    const rows = rsvps.map((rsvp) => [
      rsvp.name,
      rsvp.email,
      rsvp.phone || "",
      rsvp.instagram || "",
      rsvp.status,
      rsvp.plusOnes.toString(),
      rsvp.plusOneNames || "",
      rsvp.referralSource,
      rsvp.checkedIn ? "Yes" : "No",
      rsvp.checkedInAt ? rsvp.checkedInAt.toISOString() : "",
      rsvp.createdAt.toISOString(),
    ]);

    const csv = [csvHeaders.join(","), ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))].join("\n");

    return { success: true, csv, eventTitle: event?.title || "Event" };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Export error:", error);
    return { success: false, error: "Failed to export" };
  }
}
