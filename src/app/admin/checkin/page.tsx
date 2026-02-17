"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { checkInByQRCode } from "@/server/actions/events";
import toast from "react-hot-toast";

export default function CheckInRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setStatus("error");
      return;
    }

    async function processCheckIn(qrCode: string) {
      const result = await checkInByQRCode(qrCode);
      if (result.success) {
        setGuestName(result.guestName || "Guest");
        setStatus("success");
        toast.success(`Checked in: ${result.guestName}`);
        // Redirect to the event's check-in page after a moment
        setTimeout(() => {
          router.push(`/admin/events/${result.eventSlug || result.eventId}/checkin`);
        }, 2000);
      } else {
        setStatus("error");
        toast.error(result.error || "Check-in failed");
      }
    }

    processCheckIn(code);
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      {status === "loading" && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-bodega-yellow rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">
            Processing check-in...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-4xl text-green-400">&#10003;</span>
          </div>
          <h2 className="text-3xl font-display text-white uppercase tracking-tight mb-2">
            Checked In
          </h2>
          <p className="text-xl text-bodega-yellow font-display uppercase">
            {guestName}
          </p>
          <p className="text-zinc-500 font-mono text-xs mt-4 uppercase tracking-widest">
            Redirecting to check-in page...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-4xl text-red-400">&#10007;</span>
          </div>
          <h2 className="text-3xl font-display text-white uppercase tracking-tight mb-2">
            Check-in Failed
          </h2>
          <p className="text-zinc-500 text-sm">
            Invalid or expired QR code
          </p>
        </div>
      )}
    </div>
  );
}
