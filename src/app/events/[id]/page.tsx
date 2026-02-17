"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { submitRSVP, getEventBySlugOrId } from "@/server/actions/events";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Image from "next/image";

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
  success: boolean;
  rsvpId?: string;
  qrCode?: string;
  isUpdate?: boolean;
  error?: string;
}

export default function EventRSVPPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpResult, setRsvpResult] = useState<RSVPData | null>(null);

  useEffect(() => {
    async function loadEvent() {
      const data = await getEventBySlugOrId(eventId);
      if (data) {
        setEvent(data);
      }
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("eventId", event.id);
    formData.set("referralSource", "DIRECT");

    const result = await submitRSVP(formData);
    setRsvpResult(result);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.isUpdate ? "RSVP updated!" : "You're on the list!");
    } else {
      toast.error(result.error || "Failed to submit");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 font-mono">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Event not found</p>
      </div>
    );
  }

  const spotsLeft = event.capacity ? event.capacity - event.rsvpCount : null;
  const isAtCapacity = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        {event.flyerImage ? (
          <Image
            src={event.flyerImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeUp}
        className="max-w-2xl mx-auto px-6 -mt-32 relative z-10 pb-20"
      >
        {/* Event Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-sm p-8 backdrop-blur-sm">
          {!rsvpResult?.success ? (
            <>
              {/* Event Info */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight mb-4">
                  {event.title}
                </h1>
                <p className="text-bodega-yellow font-mono text-sm uppercase tracking-widest mb-4">
                  {format(new Date(event.eventDate), "EEEE, MMMM do 'at' h:mm a")}
                </p>
                <p className="text-zinc-400">{event.location}</p>
                {event.locationUrl && (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 text-sm hover:text-bodega-yellow transition-colors inline-flex items-center gap-1 mt-2"
                  >
                    View on Maps →
                  </a>
                )}
              </div>

              {event.description && (
                <p className="text-zinc-400 text-center mb-8 whitespace-pre-wrap">
                  {event.description}
                </p>
              )}

              {/* Capacity */}
              {spotsLeft !== null && (
                <div className="text-center mb-8">
                  <p className={`font-mono text-sm uppercase tracking-wider ${
                    spotsLeft > 10 ? "text-zinc-500" : spotsLeft > 0 ? "text-yellow-500" : "text-red-500"
                  }`}>
                    {spotsLeft > 0 ? `${spotsLeft} spots remaining` : "Event is at capacity"}
                  </p>
                </div>
              )}

              {/* RSVP Form */}
              {!isAtCapacity && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-zinc-500 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-700 focus:border-bodega-yellow focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-zinc-500 uppercase tracking-wider mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-700 focus:border-bodega-yellow focus:outline-none transition-colors"
                        placeholder="you@email.com"
                      />
                    </div>

                    {event.collectPhone && (
                      <div>
                        <label className="block text-sm font-mono text-zinc-500 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-700 focus:border-bodega-yellow focus:outline-none transition-colors"
                          placeholder="+63 912 345 6789"
                        />
                      </div>
                    )}

                    {event.collectInstagram && (
                      <div>
                        <label className="block text-sm font-mono text-zinc-500 uppercase tracking-wider mb-2">
                          Instagram
                        </label>
                        <input
                          type="text"
                          name="instagram"
                          className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-700 focus:border-bodega-yellow focus:outline-none transition-colors"
                          placeholder="@username"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-mono text-zinc-500 uppercase tracking-wider mb-3">
                        Are you going? *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["GOING", "MAYBE", "NOT_GOING"].map((status) => (
                          <label
                            key={status}
                            className="cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="status"
                              value={status}
                              defaultChecked={status === "GOING"}
                              className="peer sr-only"
                            />
                            <div className="px-4 py-3 text-center border-2 border-zinc-800 rounded-sm peer-checked:border-bodega-yellow peer-checked:bg-bodega-yellow/10 text-zinc-400 peer-checked:text-white transition-all uppercase text-sm tracking-wider">
                              {status.replace("_", " ")}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {event.allowPlusOnes && (
                      <div>
                        <label className="block text-sm font-mono text-zinc-500 uppercase tracking-wider mb-2">
                          Bringing guests?
                        </label>
                        <select
                          name="plusOnes"
                          className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 rounded-sm text-white focus:border-bodega-yellow focus:outline-none transition-colors"
                        >
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "guest" : "guests"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-bodega-yellow text-black font-bold tracking-widest uppercase hover:bg-bodega-yellow-light disabled:opacity-50 py-4"
                  >
                    {submitting ? "Submitting..." : "RSVP"}
                  </Button>
                </form>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
              <h2 className="text-3xl font-display text-white uppercase tracking-tight mb-4">
                You&apos;re on the list!
              </h2>
              <p className="text-zinc-400 mb-6">
                Check your email for your QR code confirmation.
              </p>
              {rsvpResult.qrCode && (
                <div className="bg-white p-4 rounded-sm inline-block mb-6">
                  <img
                    src={`/api/qr/${rsvpResult.qrCode}`}
                    alt="Your QR Code"
                    className="w-48 h-48"
                  />
                </div>
              )}
              <p className="text-zinc-500 text-sm">
                Show this QR code at the door for check-in
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-zinc-600 text-sm">
            Questions? Contact{" "}
            <a
              href="mailto:hello@bodegasound.com"
              className="text-zinc-400 hover:text-bodega-yellow transition-colors"
            >
              hello@bodegasound.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
