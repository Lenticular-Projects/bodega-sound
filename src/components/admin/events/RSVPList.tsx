"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { RSVPData } from "@/types/events";

interface RSVPListProps {
  rsvps: RSVPData[];
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSelectGuest: (rsvp: RSVPData) => void;
  onToggleCheckIn: (rsvpId: string, currentlyCheckedIn: boolean, name: string) => Promise<void>;
  onExportCSV: () => Promise<void>;
}

export function RSVPList({
  rsvps,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onSelectGuest,
  onToggleCheckIn,
  onExportCSV,
}: RSVPListProps): React.ReactElement {
  const filteredRSVPs = rsvps.filter((rsvp) => {
    const matchesSearch =
      rsvp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rsvp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "ALL" ||
      (statusFilter === "CHECKED_IN" && rsvp.checkedIn) ||
      (statusFilter === "NOT_CHECKED_IN" && !rsvp.checkedIn) ||
      rsvp.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors text-base"
        />
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white focus:border-bodega-yellow focus:outline-none transition-colors text-sm"
          >
            <option value="ALL">All</option>
            <option value="GOING">Going</option>
            <option value="MAYBE">Maybe</option>
            <option value="NOT_GOING">Not Going</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="NOT_CHECKED_IN">Not Checked In</option>
          </select>
          <Button
            onClick={onExportCSV}
            variant="outline"
            className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 uppercase tracking-widest text-xs shrink-0"
          >
            CSV
          </Button>
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-2">
        {filteredRSVPs.length === 0 ? (
          <p className="text-zinc-600 text-center py-12 font-mono text-xs italic">No guests found</p>
        ) : (
          filteredRSVPs.map((rsvp) => (
            <div
              key={rsvp.id}
              className={`border rounded-sm p-3 ${
                rsvp.checkedIn
                  ? "bg-green-500/5 border-green-500/30"
                  : "bg-zinc-900/20 border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onSelectGuest(rsvp)}
                    className="text-white text-sm font-bold truncate underline decoration-zinc-700 hover:decoration-bodega-yellow transition-colors text-left block max-w-full"
                  >
                    {rsvp.name}
                  </button>
                  <p className="text-zinc-500 text-xs truncate">{rsvp.email}</p>
                  {rsvp.phone && <p className="text-zinc-600 text-xs">{rsvp.phone}</p>}
                </div>
                <button
                  onClick={() => onToggleCheckIn(rsvp.id, rsvp.checkedIn, rsvp.name)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors shrink-0 ${
                    rsvp.checkedIn
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-bodega-yellow text-black"
                  }`}
                >
                  {rsvp.checkedIn ? "Checked In" : "Check In"}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
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
                  <span className="text-[10px] text-zinc-500 font-mono">+{rsvp.plusOnes}</span>
                )}
                <span className="text-[10px] text-zinc-600 font-mono ml-auto">
                  {format(new Date(rsvp.createdAt), "MMM d")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block bg-zinc-900/20 border border-zinc-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Name</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Email</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">+1s</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Source</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Checked In</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Registered</th>
              </tr>
            </thead>
            <tbody>
              {filteredRSVPs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-600 font-mono text-xs italic">
                    No guests found
                  </td>
                </tr>
              ) : (
                filteredRSVPs.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onSelectGuest(rsvp)}
                        className="text-white text-sm font-bold underline decoration-zinc-700 hover:decoration-bodega-yellow transition-colors text-left"
                      >
                        {rsvp.name}
                      </button>
                      {rsvp.phone && <p className="text-zinc-600 text-xs">{rsvp.phone}</p>}
                      {rsvp.instagram && <p className="text-zinc-600 text-xs">@{rsvp.instagram}</p>}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-sm">{rsvp.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
                        rsvp.status === "GOING" ? "bg-green-500/20 text-green-400"
                          : rsvp.status === "MAYBE" ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>{rsvp.status}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-sm font-mono">
                      {rsvp.plusOnes > 0 ? `+${rsvp.plusOnes}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase">{rsvp.referralSource}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onToggleCheckIn(rsvp.id, rsvp.checkedIn, rsvp.name)}
                        className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                          rsvp.checkedIn
                            ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-bodega-yellow hover:text-black hover:border-bodega-yellow"
                        }`}
                      >
                        {rsvp.checkedIn ? "Checked In" : "Check In"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs font-mono">
                      {format(new Date(rsvp.createdAt), "MMM d, h:mm a")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
