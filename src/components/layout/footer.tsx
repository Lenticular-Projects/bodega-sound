export function Footer() {
  return (
    <footer className="w-full py-12 px-8 border-t border-white/10 z-content relative bg-[#0A0A08]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-4xl font-display tracking-tighter mb-2 text-white">BODEGA SOUND</h2>
          <p className="text-warm-400 text-sm max-w-sm">
            Manila&apos;s underground dance music collective. Quarterly sonic experiences. International DJs. Secret locations.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-widest text-warm-500 uppercase">Connect</h3>
          <div className="flex gap-6">
            <a href="#" className="text-warm-300 hover:text-bodega-yellow transition-colors">Instagram</a>
            <a href="#" className="text-warm-300 hover:text-bodega-yellow transition-colors">SoundCloud</a>
            <a href="#" className="text-warm-300 hover:text-bodega-yellow transition-colors">Resident Advisor</a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-warm-500 uppercase">
        <p>© 2026 BODEGA SOUND COLLECTIVE. ALL RIGHTS RESERVED.</p>
        <p>MANILA / TOKYO / BERLIN</p>
      </div>
    </footer>
  );
}
