import { stateOf, tripMins } from "../utils/routing";
import { CROWD } from "../data/mockData";

const BADGE = { clear: "bg-emerald-400/15 text-emerald-300", risky: "bg-amber-400/15 text-amber-300", blocked: "bg-red-400/15 text-red-300" };
const LABEL = { clear: "Passable", risky: "Floods soon", blocked: "Unsafe by then" };
const survivalText = (r) => r.blocked ? "Fails before you reach it" : !isFinite(r.survival) ? "No flooding forecast on this route" : `Stays passable for ${r.survival} more min`;

export default function RoutePanel({ results, activeId, bestId, onSelect, profile }) {
  return (
    <ul className="space-y-2">
      {results.map((r) => {
        const st = stateOf(r), on = r.route.id === activeId, crowd = CROWD[r.route.id] ?? 0;
        return (
          <li key={r.route.id}>
            <button onClick={() => onSelect(r.route.id)} aria-pressed={on}
              className={`w-full rounded-lg border-2 p-3 text-left ${on ? "border-cyan-400 bg-slate-800" : "border-transparent bg-slate-800/60 hover:bg-slate-800"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-white">{r.route.name}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${BADGE[st]}`}>{LABEL[st]}</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{r.route.km} km, about {tripMins(r.route, profile)} min</p>
              <p className="text-sm text-slate-200">{survivalText(r)}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span>Crowd</span>
                <div className="h-1.5 flex-1 rounded bg-slate-700"><div className={`h-1.5 rounded ${crowd > 70 ? "bg-red-400" : "bg-cyan-400"}`} style={{ width: `${crowd}%` }} /></div>
                <span>{crowd > 70 ? "Busy" : "Clear"}</span>
              </div>
              {r.route.id === bestId && <p className="mt-1 text-xs font-bold text-emerald-300">Recommended</p>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
