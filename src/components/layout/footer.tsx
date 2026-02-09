export function Footer() {
  return (
    <footer className="w-full py-12 px-8 border-t border-zinc-200 dark:border-white/10 z-content relative bg-warm-50 dark:bg-[#0A0A08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-4xl font-display tracking-tighter mb-2 text-zinc-900 dark:text-white transition-colors duration-300">BODEGA SOUND</h2>
          <p className="text-zinc-600 dark:text-warm-400 text-sm max-w-sm transition-colors duration-300">
            Manila&apos;s underground dance music collective. Quarterly sonic experiences. International DJs. Secret locations.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-widest text-zinc-500 dark:text-warm-500 uppercase transition-colors duration-300">Connect</h3>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-600 dark:text-warm-300 hover:text-black dark:hover:text-bodega-yellow transition-colors duration-300">Instagram</a>
            <a href="#" className="text-zinc-600 dark:text-warm-300 hover:text-black dark:hover:text-bodega-yellow transition-colors duration-300">SoundCloud</a>
            <a href="#" className="text-zinc-600 dark:text-warm-300 hover:text-black dark:hover:text-bodega-yellow transition-colors duration-300">Resident Advisor</a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-zinc-400 dark:text-warm-500 uppercase transition-colors duration-300">
        <p>© 2026 BODEGA SOUND COLLECTIVE. ALL RIGHTS RESERVED.</p>
        <p>MANILA / TOKYO / BERLIN</p>
      </div>
    </footer>
  );
}
