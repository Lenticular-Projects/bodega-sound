"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/server/actions/events";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import toast from "react-hot-toast";

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [flyerUrl, setFlyerUrl] = useState("");
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum 5MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Invalid file type. Use JPEG, PNG, or WebP.");
      return;
    }

    setUploading(true);
    setFlyerPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setFlyerUrl(data.url);
        toast.success("Flyer uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
        setFlyerPreview(null);
      }
    } catch {
      toast.error("Upload failed");
      setFlyerPreview(null);
    } finally {
      setUploading(false);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 space-y-6">
          <h3 className="text-lg font-display text-white uppercase tracking-wider mb-4">
            Event Details
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Warehouse Party Vol. 3"
              className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe your event..."
              className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="eventDate"
                required
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white focus:border-bodega-yellow focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                Currency
              </label>
              <select
                name="currency"
                defaultValue="PHP"
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white focus:border-bodega-yellow focus:outline-none transition-colors"
              >
                <option value="PHP">PHP (₱)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="Secret Warehouse, Makati"
              className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Location URL (Google Maps)
            </label>
            <input
              type="url"
              name="locationUrl"
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Flyer Image
            </label>
            <input type="hidden" name="flyerImage" value={flyerUrl} />
            {flyerPreview ? (
              <div className="relative">
                <img
                  src={flyerPreview}
                  alt="Flyer preview"
                  className="w-full max-h-64 object-contain bg-zinc-900 border-2 border-zinc-800 rounded-sm"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <p className="text-bodega-yellow font-mono text-sm uppercase tracking-widest">
                      Uploading...
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFlyerPreview(null);
                    setFlyerUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-sm text-xs font-mono hover:bg-red-900/70 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) uploadFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-bodega-yellow bg-bodega-yellow/5"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <p className="text-zinc-400 text-sm mb-1">
                  Drop flyer image here or click to browse
                </p>
                <p className="text-zinc-600 text-xs font-mono">
                  JPEG, PNG, WebP — max 5MB — 1080×1350 or 1080×1920 recommended
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
              }}
            />
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 space-y-6">
          <h3 className="text-lg font-display text-white uppercase tracking-wider mb-4">
            Capacity & Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                Capacity (leave empty for unlimited)
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                placeholder="100"
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-mono text-zinc-400 uppercase tracking-wider">
                Ticket Price (leave empty for free)
              </label>
              <input
                type="text"
                name="ticketPrice"
                placeholder="500"
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-bodega-yellow focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Collection Settings */}
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6 space-y-6">
          <h3 className="text-lg font-display text-white uppercase tracking-wider mb-4">
            Information Collection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 border border-zinc-800 rounded-sm cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="checkbox"
                name="collectPhone"
                className="w-5 h-5 accent-bodega-yellow"
              />
              <span className="text-sm text-zinc-300">Collect phone number</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-zinc-800 rounded-sm cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="checkbox"
                name="collectInstagram"
                className="w-5 h-5 accent-bodega-yellow"
              />
              <span className="text-sm text-zinc-300">Collect Instagram handle</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-zinc-800 rounded-sm cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="checkbox"
                name="allowPlusOnes"
                className="w-5 h-5 accent-bodega-yellow"
              />
              <span className="text-sm text-zinc-300">Allow +1s</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-zinc-800 rounded-sm cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="checkbox"
                name="showGuestList"
                className="w-5 h-5 accent-bodega-yellow"
              />
              <span className="text-sm text-zinc-300">Show public guest list</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-bodega-yellow text-black font-bold tracking-widest uppercase hover:bg-bodega-yellow-light disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/events")}
            className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
