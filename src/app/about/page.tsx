export default function AboutPage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-white tracking-tight mb-8">
                THE COLLECTIVE
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mt-16">
                <div className="space-y-8">
                    <p className="text-2xl text-warm-200 leading-relaxed font-light">
                        Manila&apos;s underground dance music collective. Born in the shadows, built for the vibration of the streets.
                    </p>
                    <p className="text-warm-400 text-lg leading-relaxed">
                        Bodega Sound is more than a party. It&apos;s a curated experience designed to reclaim the energy of the dancefloor. From secret warehouses to intimate rooftops, we build temporary temples for sound architects and bass seekers.
                    </p>
                </div>

                <div className="aspect-square bg-warm-900 border border-warm-800 rounded-sm flex items-center justify-center p-12">
                    <div className="text-center">
                        <span className="text-bodega-yellow font-display text-8xl block mb-4">2AM</span>
                        <p className="text-warm-500 font-mono tracking-widest uppercase text-sm">THE TIME WE BECOME ALIVE</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
