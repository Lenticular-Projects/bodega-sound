"use client";

import { format } from "date-fns";
import Image from "next/image";
import { deleteRSVP } from "@/server/actions/events";
import toast from "react-hot-toast";
import type { RSVPData } from "@/types/events";

interface GuestDetailModalProps {
  guest: RSVPData;
  onClose: () => void;
  onToggleCheckIn: (rsvpId: string, currentlyCheckedIn: boolean, name: string) => Promise<void>;
  onDeleted: () => void;
}

export function GuestDetailModal({
  guest,
  onClose,
  onToggleCheckIn,
  onDeleted,
}: GuestDetailModalProps): React.ReactElement {
  async function handleDelete(): Promise<void> {
    if (!confirm(`Delete ${guest.name} from the guest list? This cannot be undone.`)) return;
    const result = await deleteRSVP(guest.id);
    if (result.success) {
      toast.success(`Deleted ${guest.name}`);
      onDeleted();
    } else {
      toast.error(result.error || "Delete failed");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-display text-white uppercase tracking-tight">
                {guest.name}
              </h3>
              <p className="text-zinc-500 text-sm">{guest.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors text-xl leading-none p-1"
            >
              &times;
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
                guest.status === "GOING"
                  ? "bg-green-500/20 text-green-400"
                  : guest.status === "MAYBE"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {guest.status}
            </span>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
                guest.checkedIn
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
              }`}
            >
              {guest.checkedIn ? "Checked In" : "Not Checked In"}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {guest.phone && (
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Phone</p>
                <p className="text-zinc-300 text-sm">{guest.phone}</p>
              </div>
            )}
            {guest.instagram && (
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Instagram</p>
                <p className="text-zinc-300 text-sm">@{guest.instagram}</p>
              </div>
            )}
            {guest.plusOnes > 0 && (
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Plus Ones</p>
                <p className="text-zinc-300 text-sm">
                  +{guest.plusOnes}
                  {guest.plusOneNames && ` (${guest.plusOneNames})`}
                </p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Referral Source</p>
              <p className="text-zinc-300 text-sm font-mono uppercase">{guest.referralSource}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Registered</p>
              <p className="text-zinc-300 text-sm font-mono">
                {format(new Date(guest.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            {guest.checkedIn && guest.checkedInAt && (
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Checked In At</p>
                <p className="text-zinc-300 text-sm font-mono">
                  {format(new Date(guest.checkedInAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">QR Code</p>
            <div className="bg-white p-3 rounded-sm inline-block">
              <Image
                src={`/api/qr/${guest.qrCode}`}
                alt={`QR Code for ${guest.name}`}
                width={160}
                height={160}
                unoptimized
              />
            </div>
            <p className="text-zinc-600 text-xs mt-2 font-mono">{guest.qrCode}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-zinc-800 pt-4">
            <button
              onClick={() => {
                onToggleCheckIn(guest.id, guest.checkedIn, guest.name);
                onClose();
              }}
              className={`flex-1 px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                guest.checkedIn
                  ? "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-red-500/20 hover:text-red-400"
                  : "bg-bodega-yellow text-black hover:bg-bodega-yellow-light"
              }`}
            >
              {guest.checkedIn ? "Undo Check-In" : "Check In"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider bg-transparent border border-red-900 text-red-400 hover:bg-red-900/20 transition-colors"
            >
              Delete Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
