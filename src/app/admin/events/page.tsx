import { prisma } from "@/server/db";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: "desc" },
    include: {
      rsvps: {
        where: { status: { in: ["GOING", "MAYBE"] } },
        select: { plusOnes: true },
      },
    },
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display tracking-tight text-white uppercase">Events</h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Create and manage events</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light uppercase tracking-widest font-bold text-sm">
            + New Event
          </Button>
        </Link>
      </div>

      <div className="space-y-3 md:space-y-4">
        {events.length === 0 ? (
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm px-4 md:px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">
            No events yet. Create your first event!
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-4 md:p-6 hover:border-zinc-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg md:text-xl font-display text-white uppercase tracking-tight">
                      {event.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider shrink-0 ${
                        event.status === "PUBLISHED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : event.status === "DRAFT"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-zinc-700/50 text-zinc-400 border border-zinc-600/50"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {format(new Date(event.eventDate), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-sm text-zinc-500 truncate">{event.location}</p>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-xs text-zinc-600 font-mono uppercase">
                      {event.rsvps.reduce((sum, r) => sum + 1 + r.plusOnes, 0)} RSVPs
                    </span>
                    {event.capacity && (
                      <span className="text-xs text-zinc-600 font-mono uppercase">
                        Capacity: {event.capacity}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/events/${event.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 text-xs"
                    >
                      Manage
                    </Button>
                  </Link>
                  <Link href={`/admin/events/${event.id}/checkin`}>
                    <Button
                      size="sm"
                      className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light text-xs"
                    >
                      Check-in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
