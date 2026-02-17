import { prisma } from "@/server/db";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DoorHubPage() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { eventDate: "desc" },
    include: {
      _count: {
        select: {
          rsvps: { where: { checkedIn: true } },
        },
      },
      rsvps: {
        where: { status: "GOING" },
        select: { plusOnes: true },
      },
    },
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display tracking-tight text-white uppercase">
            Door Check-In
          </h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">
            Select an event to start checking in guests
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-3 md:space-y-4">
        {events.length === 0 ? (
          <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm px-4 md:px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase italic">
            No published events
          </div>
        ) : (
          events.map((event) => {
            const goingHeadcount = event.rsvps.reduce(
              (sum, r) => sum + 1 + r.plusOnes,
              0
            );
            return (
              <div
                key={event.id}
                className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-4 md:p-6 hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-display text-white uppercase tracking-tight">
                      {event.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {format(
                        new Date(event.eventDate),
                        "MMMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">
                      {event.location}
                    </p>
                    <p className="text-xs text-zinc-600 font-mono uppercase">
                      {event._count.rsvps} / {goingHeadcount} checked in
                    </p>
                  </div>
                  <Link href={`/admin/events/${event.slug}/checkin`}>
                    <Button className="bg-bodega-yellow text-black hover:bg-bodega-yellow-light uppercase tracking-widest font-bold text-sm w-full sm:w-auto">
                      Check-In
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
