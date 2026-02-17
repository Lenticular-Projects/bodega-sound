"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import { checkInGuest, undoCheckIn, getEventRSVPs } from "@/server/actions/events";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface RSVP {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  plusOnes: number;
  checkedIn: boolean;
  qrCode: string;
}

export default function CheckInPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<RSVP | null>(null);

  // Load RSVPs
  const loadRSVPs = useCallback(async () => {
    const result = await getEventRSVPs(eventId);
    setRsvps(result);
  }, [eventId]);

  useEffect(() => {
    loadRSVPs();
  }, [loadRSVPs]);

  // Initialize QR scanner
  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText: string) => {
        // Extract QR code from URL (format: .../admin/checkin?code=qr_xxx)
        let qrCode: string | null = null;
        try {
          const url = new URL(decodedText);
          qrCode = url.searchParams.get("code");
        } catch {
          // If not a URL, treat the whole string as the code
          qrCode = decodedText;
        }
        if (!qrCode) return;

        // Find RSVP with this QR code
        const rsvp = rsvps.find((r) => r.qrCode === qrCode);
        if (!rsvp) {
          toast.error("QR code not found");
          return;
        }

        if (rsvp.checkedIn) {
          toast.error(`${rsvp.name} already checked in`);
          return;
        }

        // Check in
        const result = await checkInGuest(rsvp.id);
        if (result.success) {
          toast.success(`Checked in: ${rsvp.name}`);
          setLastCheckIn(rsvp);
          loadRSVPs();
        } else {
          toast.error("Check-in failed");
        }

        scanner.clear();
        setIsScanning(false);
      },
      (error: string) => {
        // QR scan error - ignore continuous scan errors
        console.log("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, [isScanning, rsvps, loadRSVPs]);

  const filteredRSVPs = rsvps.filter(
    (rsvp) =>
      rsvp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rsvp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goingCount = rsvps.filter((r) => r.status === "GOING").length;
  const checkedInCount = rsvps.filter((r) => r.checkedIn).length;

  async function handleManualCheckIn(rsvpId: string, name: string) {
    const result = await checkInGuest(rsvpId);
    if (result.success) {
      toast.success(`Checked in: ${name}`);
      loadRSVPs();
    } else {
      toast.error("Check-in failed");
    }
  }

  async function handleUndoCheckIn(rsvpId: string) {
    const result = await undoCheckIn(rsvpId);
    if (result.success) {
      toast.success("Check-in undone");
      loadRSVPs();
    } else {
      toast.error("Failed to undo");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display tracking-tight text-white uppercase">
            Check-In
          </h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">
            Scan QR codes or search by name
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-sm text-zinc-400 font-mono text-sm">
            {checkedInCount} / {goingCount} checked in
          </div>
        </div>
      </div>

      {/* Last Check-in */}
      {lastCheckIn && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-green-400 font-bold uppercase tracking-wider">
              Last Check-in
            </p>
            <p className="text-white text-xl font-display">{lastCheckIn.name}</p>
            <p className="text-zinc-500 text-sm">{lastCheckIn.email}</p>
          </div>
          <Button
            onClick={() => handleUndoCheckIn(lastCheckIn.id)}
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-transparent text-zinc-400 hover:text-white"
          >
            Undo
          </Button>
        </div>
      )}

      {/* QR Scanner */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-display text-white uppercase tracking-wider">
            QR Scanner
          </h3>
          <Button
            onClick={() => setIsScanning(!isScanning)}
            className={isScanning ? "bg-red-600" : "bg-bodega-yellow text-black"}
          >
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Button>
        </div>

        {isScanning && (
          <div className="max-w-md mx-auto">
            <div id="qr-reader" className="rounded-sm overflow-hidden"></div>
            <p className="text-center text-zinc-500 text-sm mt-2">
              Point camera at guest&apos;s QR code
            </p>
          </div>
        )}
      </div>

      {/* Manual Search */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 space-y-4">
        <h3 className="text-lg font-display text-white uppercase tracking-wider mb-4">
          Manual Check-In
        </h3>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredRSVPs.length === 0 ? (
            <p className="text-zinc-600 text-center py-8">No guests found</p>
          ) : (
            filteredRSVPs.map((rsvp) => (
              <div
                key={rsvp.id}
                className={`flex items-center justify-between p-4 rounded-sm border ${
                  rsvp.checkedIn
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-zinc-900/50 border-zinc-800"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{rsvp.name}</p>
                  <p className="text-zinc-500 text-sm truncate">{rsvp.email}</p>
                  {rsvp.phone && (
                    <p className="text-zinc-600 text-xs">{rsvp.phone}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        rsvp.status === "GOING"
                          ? "bg-green-500/20 text-green-400"
                          : rsvp.status === "MAYBE"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {rsvp.status}
                    </span>
                    {rsvp.plusOnes > 0 && (
                      <span className="text-[10px] text-zinc-500">
                        +{rsvp.plusOnes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {rsvp.checkedIn ? (
                    <>
                      <span className="text-green-400 text-sm font-mono">
                        ✓ Checked In
                      </span>
                      <Button
                        onClick={() => handleUndoCheckIn(rsvp.id)}
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 bg-transparent text-zinc-500 hover:text-white"
                      >
                        Undo
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleManualCheckIn(rsvp.id, rsvp.name)}
                      className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light"
                    >
                      Check In
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
