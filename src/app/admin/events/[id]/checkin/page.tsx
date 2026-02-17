"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const rsvpsRef = useRef<RSVP[]>([]);

  // Keep ref in sync so the scan callback always has fresh data
  useEffect(() => {
    rsvpsRef.current = rsvps;
  }, [rsvps]);

  const loadRSVPs = useCallback(async () => {
    const result = await getEventRSVPs(eventId);
    setRsvps(result);
  }, [eventId]);

  useEffect(() => {
    loadRSVPs();
  }, [loadRSVPs]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  async function startScanning(): Promise<void> {
    setCameraError(null);
    setIsScanning(true);

    // Small delay to let the DOM render the #qr-reader div
    await new Promise((r) => setTimeout(r, 100));

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText: string) => {
          // Extract QR code from URL (format: .../admin/checkin?code=qr_xxx)
          let qrCode: string | null = null;
          try {
            const url = new URL(decodedText);
            qrCode = url.searchParams.get("code");
          } catch {
            qrCode = decodedText;
          }
          if (!qrCode) return;

          // Find RSVP with this QR code using ref for fresh data
          const rsvp = rsvpsRef.current.find((r) => r.qrCode === qrCode);
          if (!rsvp) {
            toast.error("QR code not found");
            return;
          }

          if (rsvp.checkedIn) {
            toast.error(`${rsvp.name} already checked in`);
            return;
          }

          // Stop scanner before async operation
          await scanner.stop().catch(() => {});
          scannerRef.current = null;
          setIsScanning(false);

          const result = await checkInGuest(rsvp.id);
          if (result.success) {
            toast.success(`Checked in: ${rsvp.name}`);
            setLastCheckIn(rsvp);
            loadRSVPs();
          } else {
            toast.error("Check-in failed");
          }
        },
        () => {
          // Continuous scan errors — ignore (no QR in frame yet)
        }
      );
    } catch (err) {
      setIsScanning(false);
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes("NotAllowedError") || message.includes("Permission")) {
        setCameraError(
          "Camera permission denied. Open your browser settings and allow camera access for this site, then try again."
        );
      } else if (message.includes("NotFoundError") || message.includes("no camera")) {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError(`Camera error: ${message}`);
      }
    }
  }

  async function stopScanning(): Promise<void> {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setIsScanning(false);
  }

  const filteredRSVPs = rsvps.filter(
    (rsvp) =>
      rsvp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rsvp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goingCount = rsvps.filter((r) => r.status === "GOING").length;
  const checkedInCount = rsvps.filter((r) => r.checkedIn).length;

  async function handleManualCheckIn(rsvpId: string, name: string): Promise<void> {
    const result = await checkInGuest(rsvpId);
    if (result.success) {
      toast.success(`Checked in: ${name}`);
      loadRSVPs();
    } else {
      toast.error("Check-in failed");
    }
  }

  async function handleUndoCheckIn(rsvpId: string): Promise<void> {
    const result = await undoCheckIn(rsvpId);
    if (result.success) {
      toast.success("Check-in undone");
      loadRSVPs();
    } else {
      toast.error("Failed to undo");
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-display tracking-tight text-white uppercase">
            Check-In
          </h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">
            Scan QR codes or search by name
          </p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-sm text-zinc-400 font-mono text-sm">
          {checkedInCount} / {goingCount} checked in
        </div>
      </div>

      {/* Last Check-in */}
      {lastCheckIn && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-green-400 font-bold uppercase tracking-wider text-xs">
              Last Check-in
            </p>
            <p className="text-white text-lg md:text-xl font-display truncate">{lastCheckIn.name}</p>
            <p className="text-zinc-500 text-sm truncate">{lastCheckIn.email}</p>
          </div>
          <Button
            onClick={() => handleUndoCheckIn(lastCheckIn.id)}
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-transparent text-zinc-400 hover:text-white shrink-0"
          >
            Undo
          </Button>
        </div>
      )}

      {/* QR Scanner */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-display text-white uppercase tracking-wider">
            QR Scanner
          </h3>
          <Button
            onClick={isScanning ? stopScanning : startScanning}
            className={isScanning ? "bg-red-600 text-white" : "bg-bodega-yellow text-black"}
          >
            {isScanning ? "Stop" : "Start Scanning"}
          </Button>
        </div>

        {cameraError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 mb-4">
            <p className="text-red-400 text-sm">{cameraError}</p>
          </div>
        )}

        {isScanning && (
          <div className="max-w-sm mx-auto">
            <div id="qr-reader" className="rounded-sm overflow-hidden" />
            <p className="text-center text-zinc-500 text-sm mt-2">
              Point camera at guest&apos;s QR code
            </p>
          </div>
        )}

        {/* Fallback: always show the div even when not scanning so it exists in DOM */}
        {!isScanning && <div id="qr-reader" className="hidden" />}
      </div>

      {/* Manual Search */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-4 md:p-6 space-y-3">
        <h3 className="text-base md:text-lg font-display text-white uppercase tracking-wider">
          Manual Check-In
        </h3>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors text-base"
        />

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredRSVPs.length === 0 ? (
            <p className="text-zinc-600 text-center py-8">No guests found</p>
          ) : (
            filteredRSVPs.map((rsvp) => (
              <div
                key={rsvp.id}
                className={`flex items-center justify-between p-3 md:p-4 rounded-sm border gap-3 ${
                  rsvp.checkedIn
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-zinc-900/50 border-zinc-800"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate text-sm md:text-base">{rsvp.name}</p>
                  <p className="text-zinc-500 text-xs md:text-sm truncate">{rsvp.email}</p>
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

                <div className="shrink-0">
                  {rsvp.checkedIn ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-xs font-mono hidden sm:inline">
                        &#10003;
                      </span>
                      <Button
                        onClick={() => handleUndoCheckIn(rsvp.id)}
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 bg-transparent text-zinc-500 hover:text-white text-xs"
                      >
                        Undo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleManualCheckIn(rsvp.id, rsvp.name)}
                      size="sm"
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
