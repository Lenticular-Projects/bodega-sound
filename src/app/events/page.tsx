export default function EventsPage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-white tracking-tight mb-8">
                EVENTS
            </h1>
            <p className="text-warm-300 text-xl max-w-2xl">
                Upcoming gatherings and secret location reveals. Secure your position in the collective.
            </p>

            <div className="mt-16 space-y-24">
                <div className="border-t border-warm-800 pt-12">
                    <span className="text-bodega-yellow font-mono text-sm tracking-widest uppercase">June 21, 2025</span>
                    <h2 className="font-['Bebas_Neue'] text-6xl md:text-8xl text-white mt-4">CONTRABANDA V</h2>
                    <p className="text-warm-400 mt-4 max-w-xl">Our summer solstice celebration. 8 hours of house, techno, and open-format selections.</p>
                    <button className="mt-8 px-8 py-4 bg-bodega-yellow text-black font-bold uppercase tracking-wider rounded-sm hover:bg-white transition-colors">
                        Secure Your Spot
                    </button>
                </div>
            </div>
        </div>
    );
}
