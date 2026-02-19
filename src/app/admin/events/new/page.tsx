"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/server/actions/events";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { EventForm } from "@/components/admin/events/EventForm";
import toast from "react-hot-toast";

export default function CreateEventPage(): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData): Promise<void> {
    setIsLoading(true);
    const result = await createEvent(formData);
    setIsLoading(false);

    if (result.success) {
      toast.success("Event created!");
      router.push(`/admin/events/${result.slug || result.eventId}`);
    } else {
      toast.error(result.error || "Failed to create event");
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-display tracking-tight text-white uppercase">
          Create Event
        </h2>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">
          Set up your event details
        </p>
      </div>

      <EventForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={() => router.push("/admin/events")}
      />
    </motion.div>
  );
}
