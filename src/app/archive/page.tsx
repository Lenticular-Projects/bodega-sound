export default function ArchivePage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-white tracking-tight mb-8">
                ARCHIVE
            </h1>
            <p className="text-warm-300 text-xl max-w-2xl">
                A visual history of our gatherings. Every set, every room, every movement captured.
            </p>

            {/* Gallery placeholder */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-warm-900 rounded-sm flex items-center justify-center border border-warm-800 group cursor-pointer hover:border-bodega-yellow transition-colors">
                        <span className="text-warm-600 font-display text-4xl group-hover:text-bodega-yellow transition-colors">CONTRABANDA 0{i}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
