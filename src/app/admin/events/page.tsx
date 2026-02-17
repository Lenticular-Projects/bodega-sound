import { prisma } from "@/server/db";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: "desc" },
    include: {
      _count: {
        select: { rsvps: { where: { status: { in: ["GOING", "MAYBE"] } } } },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-display tracking-tight text-white uppercase">Events</h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Create and manage events</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light uppercase tracking-widest font-bold">
            + New Event
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">
            No events yet. Create your first event!
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-display text-white uppercase tracking-tight">
                      {event.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider ${
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
                  <p className="text-sm text-zinc-500">{event.location}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-xs text-zinc-600 font-mono uppercase">
                      {event._count.rsvps} RSVPs
                    </span>
                    {event.capacity && (
                      <span className="text-xs text-zinc-600 font-mono uppercase">
                        Capacity: {event.capacity}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/events/${event.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                    >
                      Manage
                    </Button>
                  </Link>
                  <Link href={`/admin/events/${event.id}/checkin`}>
                    <Button
                      size="sm"
                      className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light"
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
