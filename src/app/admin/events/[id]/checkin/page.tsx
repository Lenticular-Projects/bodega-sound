"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { checkInGuest, undoCheckIn, getEventRSVPs, getEventBySlugOrId } from "@/server/actions/events";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface RSVP {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  status: string;
  plusOnes: number;
  plusOneNames: string | null;
  checkedIn: boolean;
  checkedInAt: Date | string | null;
  qrCode: string;
}

export default function CheckInPage() {
  const params = useParams();
  const slugOrId = params.id as string;
  const [resolvedEventId, setResolvedEventId] = useState<string>(slugOrId);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<RSVP | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<RSVP | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const rsvpsRef = useRef<RSVP[]>([]);

  // Keep ref in sync so the scan callback always has fresh data
  useEffect(() => {
    rsvpsRef.current = rsvps;
  }, [rsvps]);

  // Resolve slug to real event ID on mount
  useEffect(() => {
    async function resolve() {
      const event = await getEventBySlugOrId(slugOrId);
      if (event) setResolvedEventId(event.id);
    }
    resolve();
  }, [slugOrId]);

  const loadRSVPs = useCallback(async () => {
    const result = await getEventRSVPs(resolvedEventId);
    setRsvps(result);
  }, [resolvedEventId]);

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

  const goingCount = rsvps.filter((r) => r.status === "GOING").reduce((sum, r) => sum + 1 + r.plusOnes, 0);
  const checkedInCount = rsvps.filter((r) => r.checkedIn).reduce((sum, r) => sum + 1 + r.plusOnes, 0);

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
          <Link
            href={`/admin/events/${slugOrId}`}
            className="text-zinc-600 font-mono text-xs uppercase tracking-widest hover:text-zinc-400 transition-colors mb-2 inline-block"
          >
            ← Back to Event
          </Link>
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
                  <button
                    onClick={() => setSelectedGuest(rsvp)}
                    className="text-white font-bold truncate text-sm md:text-base underline decoration-zinc-700 hover:decoration-bodega-yellow transition-colors text-left block max-w-full"
                  >
                    {rsvp.name}
                  </button>
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

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedGuest(null)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-sm w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-display text-white uppercase tracking-tight">
                    {selectedGuest.name}
                  </h3>
                  <p className="text-zinc-500 text-sm">{selectedGuest.email}</p>
                </div>
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="text-zinc-500 hover:text-white transition-colors text-xl leading-none p-1"
                >
                  &times;
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
                    selectedGuest.status === "GOING"
                      ? "bg-green-500/20 text-green-400"
                      : selectedGuest.status === "MAYBE"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {selectedGuest.status}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
                    selectedGuest.checkedIn
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {selectedGuest.checkedIn ? "Checked In" : "Not Checked In"}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {selectedGuest.phone && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Phone</p>
                    <p className="text-zinc-300">{selectedGuest.phone}</p>
                  </div>
                )}
                {selectedGuest.instagram && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Instagram</p>
                    <p className="text-zinc-300">@{selectedGuest.instagram}</p>
                  </div>
                )}
                {selectedGuest.plusOnes > 0 && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Plus Ones</p>
                    <p className="text-zinc-300">
                      +{selectedGuest.plusOnes}
                      {selectedGuest.plusOneNames && ` (${selectedGuest.plusOneNames})`}
                    </p>
                  </div>
                )}
              </div>

              {/* QR Code */}
              <div className="border-t border-zinc-800 pt-3">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">QR Code</p>
                <div className="bg-white p-2 rounded-sm inline-block">
                  <img
                    src={`/api/qr/${selectedGuest.qrCode}`}
                    alt={`QR Code for ${selectedGuest.name}`}
                    className="w-32 h-32"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-zinc-800 pt-3">
                <button
                  onClick={() => {
                    if (selectedGuest.checkedIn) {
                      handleUndoCheckIn(selectedGuest.id);
                    } else {
                      handleManualCheckIn(selectedGuest.id, selectedGuest.name);
                    }
                    setSelectedGuest(null);
                  }}
                  className={`w-full px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                    selectedGuest.checkedIn
                      ? "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-red-500/20 hover:text-red-400"
                      : "bg-bodega-yellow text-black hover:bg-bodega-yellow-light"
                  }`}
                >
                  {selectedGuest.checkedIn ? "Undo Check-In" : "Check In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
