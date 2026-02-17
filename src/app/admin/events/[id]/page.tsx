"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import {
  getEventBySlugOrId,
  getEventRSVPs,
  manualAddGuest,
  exportRSVPsToCSV,
  deleteEvent,
  updateEvent,
  checkInGuest,
  undoCheckIn,
  deleteRSVP,
} from "@/server/actions/events";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import toast from "react-hot-toast";

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  eventDate: Date | string;
  location: string;
  locationUrl: string | null;
  flyerImage: string | null;
  capacity: number | null;
  ticketPrice: string | null;
  currency: string;
  status: string;
  collectInstagram: boolean;
  collectPhone: boolean;
  allowPlusOnes: boolean;
  showGuestList: boolean;
  rsvpCount: number;
}

interface RSVPData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  status: string;
  plusOnes: number;
  plusOneNames: string | null;
  referralSource: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt: Date | string | null;
  createdAt: Date | string;
}

type TabKey = "overview" | "guests" | "add-guest";

export default function EventManagePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [addingGuest, setAddingGuest] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<RSVPData | null>(null);

  // The URL param may be a slug or cuid — resolve the real event ID for data operations
  const resolvedEventId = event?.id || eventId;

  const loadData = useCallback(async () => {
    const eventData = await getEventBySlugOrId(eventId);
    if (eventData) {
      setEvent(eventData);
      const rsvpData = await getEventRSVPs(eventData.id);
      setRsvps(rsvpData);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Loading event...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-zinc-500">Event not found</p>
      </div>
    );
  }

  const totalHeadcount = rsvps.reduce((sum, r) => sum + 1 + r.plusOnes, 0);
  const goingCount = rsvps.filter((r) => r.status === "GOING").reduce((sum, r) => sum + 1 + r.plusOnes, 0);
  const maybeCount = rsvps.filter((r) => r.status === "MAYBE").reduce((sum, r) => sum + 1 + r.plusOnes, 0);
  const notGoingCount = rsvps.filter((r) => r.status === "NOT_GOING").reduce((sum, r) => sum + 1 + r.plusOnes, 0);
  const checkedInCount = rsvps.filter((r) => r.checkedIn).reduce((sum, r) => sum + 1 + r.plusOnes, 0);

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

  const rsvpLink = `${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.slug || event.id}`;

  async function handleCopyLink(): Promise<void> {
    await navigator.clipboard.writeText(rsvpLink);
    toast.success("RSVP link copied!");
  }

  async function handleExportCSV(): Promise<void> {
    const result = await exportRSVPsToCSV(resolvedEventId);
    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.eventTitle}-guest-list.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported!");
    } else {
      toast.error("Export failed");
    }
  }

  async function handleDeleteEvent(): Promise<void> {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    const result = await deleteEvent(resolvedEventId);
    if (result.success) {
      toast.success("Event deleted");
      router.push("/admin/events");
    } else {
      toast.error(result.error || "Delete failed");
    }
  }

  async function handleToggleCheckIn(rsvpId: string, currentlyCheckedIn: boolean, name: string): Promise<void> {
    if (currentlyCheckedIn) {
      const result = await undoCheckIn(rsvpId);
      if (result.success) {
        toast.success(`Undid check-in for ${name}`);
        loadData();
      }
    } else {
      const result = await checkInGuest(rsvpId);
      if (result.success) {
        toast.success(`Checked in: ${name}`);
        loadData();
      }
    }
  }

  async function handleAddGuest(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setAddingGuest(true);
    const formData = new FormData(e.currentTarget);
    const result = await manualAddGuest(resolvedEventId, formData);
    setAddingGuest(false);

    if (result.success) {
      toast.success("Guest added!");
      setActiveTab("guests");
      loadData();
    } else {
      toast.error(result.error || "Failed to add guest");
    }
  }

  async function handleUpdateStatus(newStatus: string): Promise<void> {
    const formData = new FormData();
    formData.set("title", event!.title);
    formData.set("eventDate", new Date(event!.eventDate).toISOString());
    formData.set("location", event!.location);
    formData.set("locationUrl", event!.locationUrl || "");
    formData.set("flyerImage", event!.flyerImage || "");
    formData.set("description", event!.description || "");
    formData.set("currency", event!.currency);
    formData.set("ticketPrice", event!.ticketPrice || "");
    if (event!.capacity) formData.set("capacity", event!.capacity.toString());
    if (event!.collectPhone) formData.set("collectPhone", "on");
    if (event!.collectInstagram) formData.set("collectInstagram", "on");
    if (event!.allowPlusOnes) formData.set("allowPlusOnes", "on");
    if (event!.showGuestList) formData.set("showGuestList", "on");

    // We need to update the status separately since the schema doesn't include it
    // For now we use a direct approach
    const result = await updateEvent(resolvedEventId, formData);
    if (result.success) {
      toast.success(`Event status updated`);
      loadData();
    }
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "guests", label: `Guests (${rsvps.length})` },
    { key: "add-guest", label: "Add Guest" },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUp} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            href="/admin/events"
            className="text-zinc-600 font-mono text-xs uppercase tracking-widest hover:text-zinc-400 transition-colors mb-2 inline-block"
          >
            ← Back to Events
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl md:text-4xl font-display tracking-tight text-white uppercase">
              {event.title}
            </h2>
            <span
              className={`px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider ${
                event.status === "PUBLISHED"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : event.status === "DRAFT"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : event.status === "CLOSED"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-zinc-700/50 text-zinc-400 border border-zinc-600/50"
              }`}
            >
              {event.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/events/${event.slug || eventId}/checkin`}>
            <Button className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light uppercase tracking-widest font-bold">
              Check-In Mode
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
        {[
          { label: "Total", value: totalHeadcount, filter: "ALL" },
          { label: "Going", value: goingCount, filter: "GOING" },
          { label: "Maybe", value: maybeCount, filter: "MAYBE" },
          { label: "Not Going", value: notGoingCount, filter: "NOT_GOING" },
          { label: "Checked In", value: checkedInCount, filter: "CHECKED_IN" },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => {
              setActiveTab("guests");
              setStatusFilter(stat.filter);
            }}
            className={`bg-zinc-900/20 border rounded-sm p-3 md:p-4 text-center cursor-pointer transition-colors ${
              activeTab === "guests" && statusFilter === stat.filter
                ? "border-bodega-yellow"
                : "border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <p className="text-xl md:text-2xl font-display text-white">{stat.value}</p>
            <p className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-mono uppercase tracking-widest transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.key
                ? "text-bodega-yellow border-b-2 border-bodega-yellow"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Details */}
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 space-y-4">
            <h3 className="text-lg font-display text-white uppercase tracking-wider">
              Event Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Date & Time
                </p>
                <p className="text-zinc-300 font-mono text-sm">
                  {format(new Date(event.eventDate), "EEEE, MMMM do yyyy 'at' h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Location
                </p>
                <p className="text-zinc-300 text-sm">{event.location}</p>
                {event.locationUrl && (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bodega-yellow text-xs hover:underline"
                  >
                    View on Maps →
                  </a>
                )}
              </div>
              {event.capacity && (
                <div>
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    Capacity
                  </p>
                  <p className="text-zinc-300 font-mono text-sm">
                    {event.rsvpCount} / {event.capacity} spots filled
                  </p>
                </div>
              )}
              {event.description && (
                <div>
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    Description
                  </p>
                  <p className="text-zinc-400 text-sm whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* RSVP Link & Actions */}
          <div className="space-y-6">
            <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 space-y-4">
              <h3 className="text-lg font-display text-white uppercase tracking-wider">
                Share Event
              </h3>
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  RSVP Link
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={rsvpLink}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-400 font-mono text-xs"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light font-bold uppercase tracking-widest"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
                  Collection Settings
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.collectPhone && (
                    <span className="text-[10px] px-2 py-1 bg-zinc-800 rounded-sm text-zinc-400 font-mono">
                      Phone
                    </span>
                  )}
                  {event.collectInstagram && (
                    <span className="text-[10px] px-2 py-1 bg-zinc-800 rounded-sm text-zinc-400 font-mono">
                      Instagram
                    </span>
                  )}
                  {event.allowPlusOnes && (
                    <span className="text-[10px] px-2 py-1 bg-zinc-800 rounded-sm text-zinc-400 font-mono">
                      +1s Allowed
                    </span>
                  )}
                  {event.showGuestList && (
                    <span className="text-[10px] px-2 py-1 bg-zinc-800 rounded-sm text-zinc-400 font-mono">
                      Public Guest List
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 space-y-3">
              <h3 className="text-lg font-display text-white uppercase tracking-wider">
                Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 uppercase tracking-widest text-xs"
                >
                  Export CSV
                </Button>
                <Button
                  onClick={handleDeleteEvent}
                  variant="outline"
                  className="border-red-900 bg-transparent text-red-400 hover:bg-red-900/20 uppercase tracking-widest text-xs"
                >
                  Delete Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "guests" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors text-base"
            />
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                onClick={handleExportCSV}
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
                        onClick={() => setSelectedGuest(rsvp)}
                        className="text-white text-sm font-bold truncate underline decoration-zinc-700 hover:decoration-bodega-yellow transition-colors text-left block max-w-full"
                      >
                        {rsvp.name}
                      </button>
                      <p className="text-zinc-500 text-xs truncate">{rsvp.email}</p>
                      {rsvp.phone && <p className="text-zinc-600 text-xs">{rsvp.phone}</p>}
                    </div>
                    <button
                      onClick={() => handleToggleCheckIn(rsvp.id, rsvp.checkedIn, rsvp.name)}
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
                            onClick={() => setSelectedGuest(rsvp)}
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
                            onClick={() => handleToggleCheckIn(rsvp.id, rsvp.checkedIn, rsvp.name)}
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
      )}

      {activeTab === "add-guest" && (
        <div className="max-w-lg">
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6">
            <h3 className="text-lg font-display text-white uppercase tracking-wider mb-6">
              Manually Add Guest
            </h3>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
                  placeholder="Guest name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
                  placeholder="guest@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
                  placeholder="+63 912 345 6789"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue="GOING"
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white focus:border-bodega-yellow focus:outline-none transition-colors"
                >
                  <option value="GOING">Going</option>
                  <option value="MAYBE">Maybe</option>
                  <option value="NOT_GOING">Not Going</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Plus Ones
                </label>
                <input
                  type="number"
                  name="plusOnes"
                  min="0"
                  max="10"
                  defaultValue="0"
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white focus:border-bodega-yellow focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Plus One Names
                </label>
                <input
                  type="text"
                  name="plusOneNames"
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
                  placeholder="John, Jane"
                />
              </div>
              <Button
                type="submit"
                disabled={addingGuest}
                className="w-full bg-bodega-yellow text-black font-bold tracking-widest uppercase hover:bg-bodega-yellow-light disabled:opacity-50"
              >
                {addingGuest ? "Adding..." : "Add Guest"}
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedGuest(null)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-5">
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

              {/* Status Badge */}
              <div className="flex items-center gap-3">
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

              {/* Details Grid */}
              <div className="space-y-3">
                {selectedGuest.phone && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Phone</p>
                    <p className="text-zinc-300 text-sm">{selectedGuest.phone}</p>
                  </div>
                )}
                {selectedGuest.instagram && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Instagram</p>
                    <p className="text-zinc-300 text-sm">@{selectedGuest.instagram}</p>
                  </div>
                )}
                {selectedGuest.plusOnes > 0 && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Plus Ones</p>
                    <p className="text-zinc-300 text-sm">
                      +{selectedGuest.plusOnes}
                      {selectedGuest.plusOneNames && ` (${selectedGuest.plusOneNames})`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Referral Source</p>
                  <p className="text-zinc-300 text-sm font-mono uppercase">{selectedGuest.referralSource}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Registered</p>
                  <p className="text-zinc-300 text-sm font-mono">
                    {format(new Date(selectedGuest.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                {selectedGuest.checkedIn && selectedGuest.checkedInAt && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Checked In At</p>
                    <p className="text-zinc-300 text-sm font-mono">
                      {format(new Date(selectedGuest.checkedInAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}
              </div>

              {/* QR Code */}
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">QR Code</p>
                <div className="bg-white p-3 rounded-sm inline-block">
                  <img
                    src={`/api/qr/${selectedGuest.qrCode}`}
                    alt={`QR Code for ${selectedGuest.name}`}
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-zinc-600 text-xs mt-2 font-mono">{selectedGuest.qrCode}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t border-zinc-800 pt-4">
                <button
                  onClick={() => {
                    handleToggleCheckIn(selectedGuest.id, selectedGuest.checkedIn, selectedGuest.name);
                    setSelectedGuest(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                    selectedGuest.checkedIn
                      ? "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-red-500/20 hover:text-red-400"
                      : "bg-bodega-yellow text-black hover:bg-bodega-yellow-light"
                  }`}
                >
                  {selectedGuest.checkedIn ? "Undo Check-In" : "Check In"}
                </button>
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="border-t border-zinc-800 pt-4">
                <button
                  onClick={async () => {
                    if (!confirm(`Delete ${selectedGuest.name} from the guest list? This cannot be undone.`)) return;
                    const result = await deleteRSVP(selectedGuest.id);
                    if (result.success) {
                      toast.success(`Deleted ${selectedGuest.name}`);
                      setSelectedGuest(null);
                      loadData();
                    } else {
                      toast.error(result.error || "Delete failed");
                    }
                  }}
                  className="w-full px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider bg-transparent border border-red-900 text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  Delete Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
