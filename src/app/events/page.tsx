export default function EventsPage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-zinc-900 dark:text-white tracking-tight mb-8 transition-colors duration-300">
                EVENTS
            </h1>
            <p className="text-zinc-600 dark:text-warm-300 text-xl max-w-2xl transition-colors duration-300">
                Upcoming gatherings and secret location reveals. Secure your position in the collective.
            </p>

            <div className="mt-16 space-y-24">
                <div className="border-t border-zinc-200 dark:border-warm-800 pt-12 transition-colors duration-300">
                    <span className="text-zinc-500 dark:text-bodega-yellow font-mono text-sm tracking-widest uppercase transition-colors duration-300">June 21, 2025</span>
                    <h2 className="font-['Bebas_Neue'] text-6xl md:text-8xl text-zinc-900 dark:text-white mt-4 transition-colors duration-300">CONTRABANDA V</h2>
                    <p className="text-zinc-700 dark:text-warm-400 mt-4 max-w-xl transition-colors duration-300">Our summer solstice celebration. 8 hours of house, techno, and open-format selections.</p>
                    <button className="mt-8 px-8 py-4 bg-black dark:bg-bodega-yellow text-white dark:text-black font-bold uppercase tracking-wider rounded-sm hover:bg-zinc-800 dark:hover:bg-white transition-colors duration-300">
                        Secure Your Spot
                    </button>
                </div>
            </div>
        </div>
    );
}
