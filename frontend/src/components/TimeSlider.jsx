const COLOR = { clear: "#34d399", risky: "#fbbf24", blocked: "#f87171" };

export default function TimeSlider({ t, onChange, timeline, playing, onPlay }) {
  const n = timeline.length;
  const stops = timeline.map((s, i) => `${COLOR[s]} ${(i / n) * 100}% ${((i + 1) / n) * 100}%`).join(", ");
  return (
    <div className="absolute inset-x-3 bottom-3 z-[1000] rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl md:inset-x-6 md:bottom-6">
      <div className="mb-3 flex items-center gap-3">
        <button onClick={onPlay} className="rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-300">
          {playing ? "Pause" : "Play flood"}
        </button>
        <div>
          <p className="text-lg font-bold text-white">{t === 0 ? "Leaving now" : `Leaving in ${t} min`}</p>
          <p className="text-sm text-slate-400">The bar shows when your selected route fails</p>
        </div>
      </div>
      <input type="range" min={0} max={120} step={5} value={t} onChange={(e) => onChange(Number(e.target.value))}
        className="time-slider w-full" style={{ "--track": `linear-gradient(to right, ${stops})` }} aria-label="Minutes until you leave" />
      <div className="mt-2 flex justify-between text-xs text-slate-400"><span>Now</span><span>1 hour</span><span>2 hours</span></div>
    </div>
  );
}
