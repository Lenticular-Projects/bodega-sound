"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { EventData } from "@/types/events";

interface EventEditFormProps {
  event: EventData;
  rsvpLink: string;
  onCopyLink: () => Promise<void>;
  onExportCSV: () => Promise<void>;
  onDeleteEvent: () => Promise<void>;
}

export function EventEditForm({
  event,
  rsvpLink,
  onCopyLink,
  onExportCSV,
  onDeleteEvent,
}: EventEditFormProps): React.ReactElement {
  return (
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
                onClick={onCopyLink}
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
              onClick={onExportCSV}
              variant="outline"
              className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 uppercase tracking-widest text-xs"
            >
              Export CSV
            </Button>
            <Button
              onClick={onDeleteEvent}
              variant="outline"
              className="border-red-900 bg-transparent text-red-400 hover:bg-red-900/20 uppercase tracking-widest text-xs"
            >
              Delete Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
