import { useEffect, useState } from "react";
import { SHELTERS } from "../data/mockData";
import { PROFILES } from "../utils/routing";
import RoutePanel from "./RoutePanel";

export default function Sidebar({ shelterId, onShelter, results, activeId, bestId, onSelect, hazards, reporting, onToggleReport, onClearHazards, profileKey, onProfile, smsText }) {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true), down = () => setOnline(false);
    window.addEventListener("online", up); window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  const h2 = "mt-5 mb-2 font-bold text-white";

  return (
    <aside className="max-h-[48vh] w-full shrink-0 overflow-y-auto border-slate-800 bg-slate-900 p-4 text-slate-200 md:max-h-none md:w-96 md:border-r">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Evacuation router</h1>
          <p className="text-sm text-slate-400">Amritsar, sample flood scenario</p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-bold ${online ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400 text-slate-950"}`}>{online ? "Online" : "Offline mode"}</span>
      </div>

      <h2 className={h2}>Who is travelling</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(PROFILES).map(([k, p]) => (
          <button key={k} onClick={() => onProfile(k)} aria-pressed={k === profileKey}
            className={`rounded-lg px-3 py-2 text-sm font-bold ${k === profileKey ? "bg-cyan-400 text-slate-950" : "bg-slate-800 hover:bg-slate-700"}`}>{p.label}</button>
        ))}
      </div>

      <h2 className={h2}>Where to go</h2>
      <div className="space-y-2">
        {SHELTERS.map((s) => {
          const pct = Math.round((s.occupied / s.capacity) * 100), on = s.id === shelterId;
          return (
            <button key={s.id} onClick={() => onShelter(s.id)} aria-pressed={on}
              className={`w-full rounded-lg border-2 p-3 text-left ${on ? "border-cyan-400 bg-slate-800" : "border-slate-700 hover:border-slate-500"}`}>
              <div className="flex justify-between"><span className="font-bold text-white">{s.name}</span><span className="text-sm text-slate-400">{pct}% full</span></div>
              <div className="mt-2 h-2 rounded bg-slate-700"><div className={`h-2 rounded ${pct > 85 ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} /></div>
            </button>
          );
        })}
      </div>

      <h2 className={h2}>Routes at this departure time</h2>
      {!bestId && <p className="mb-2 rounded-lg bg-red-400/10 p-3 text-sm text-red-200">No route to this shelter is safe at this time. Pick another shelter or move the slider earlier.</p>}
      <RoutePanel results={results} activeId={activeId} bestId={bestId} onSelect={onSelect} profile={PROFILES[profileKey]} />
      <a href={`sms:?body=${encodeURIComponent(smsText)}`} className="mt-2 block rounded-lg border border-slate-600 px-4 py-3 text-center font-bold hover:bg-slate-800">Send this route by SMS</a>

      <h2 className={h2}>Road reports</h2>
      <button onClick={onToggleReport} className={`w-full rounded-lg px-4 py-3 font-bold ${reporting ? "bg-red-400 text-slate-950" : "bg-slate-800 hover:bg-slate-700"}`}>
        {reporting ? "Tap the map to place the report" : "Report a blocked road"}
      </button>
      <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
        <span>{hazards.length} report{hazards.length === 1 ? "" : "s"} placed</span>
        {hazards.length > 0 && <button onClick={onClearHazards} className="font-bold underline">Clear reports</button>}
      </div>
    </aside>
  );
}
