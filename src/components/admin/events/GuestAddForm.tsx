"use client";

import { Button } from "@/components/ui/button";

interface GuestAddFormProps {
  addingGuest: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function GuestAddForm({ addingGuest, onSubmit }: GuestAddFormProps): React.ReactElement {
  return (
    <div className="max-w-lg">
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-6">
        <h3 className="text-lg font-display text-white uppercase tracking-wider mb-6">
          Manually Add Guest
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
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
  );
}
