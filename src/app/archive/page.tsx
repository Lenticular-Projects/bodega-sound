export default function ArchivePage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="font-['Bebas_Neue'] text-7xl md:text-9xl text-zinc-900 dark:text-white tracking-tight mb-8 transition-colors duration-300">
                ARCHIVE
            </h1>
            <p className="text-zinc-600 dark:text-warm-300 text-xl max-w-2xl transition-colors duration-300">
                A visual history of our gatherings. Every set, every room, every movement captured.
            </p>

            {/* Gallery placeholder */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-zinc-100 dark:bg-warm-900 rounded-sm flex items-center justify-center border border-zinc-200 dark:border-warm-800 group cursor-pointer hover:border-black dark:hover:border-bodega-yellow transition-all duration-300">
                        <span className="text-zinc-400 dark:text-warm-600 font-display text-4xl group-hover:text-black dark:group-hover:text-bodega-yellow transition-colors duration-300">CONTRABANDA 0{i}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
