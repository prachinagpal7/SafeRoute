import { useEffect, useMemo, useState } from "react";
import "./ui.css";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import TimeSlider from "./components/TimeSlider";
import { SHELTERS } from "./data/mockData";
import { PROFILES, evaluate, pickBest, stateOf, tripMins } from "./utils/routing";

export default function App() {
  const [t, setT] = useState(0);
  const [shelterId, setShelterId] = useState(SHELTERS[0].id);
  const [chosenId, setChosenId] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [reporting, setReporting] = useState(false);
  const [profileKey, setProfileKey] = useState("car");
  const [playing, setPlaying] = useState(false);
  const profile = PROFILES[profileKey];

  // "Play flood": step the slider forward so judges watch the roads fail
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => { if (v >= 120) { setPlaying(false); return v; } return v + 5; }), 350);
    return () => clearInterval(id);
  }, [playing]);

  const shelter = SHELTERS.find((s) => s.id === shelterId);
  const results = useMemo(() => shelter.routes.map((route) => ({ route, ...evaluate(route, t, hazards, profile) })), [shelter, t, hazards, profile]);
  const best = pickBest([...results]);
  const active = results.find((r) => r.route.id === chosenId) ?? best ?? results[0];
  const timeline = useMemo(() => Array.from({ length: 25 }, (_, i) => stateOf(evaluate(active.route, i * 5, hazards, profile))), [active.route, hazards, profile]);

  const smsText = best
    ? `Evacuation: leave ${t === 0 ? "now" : `in ${t} min`} via ${best.route.name} to ${shelter.name}. About ${tripMins(best.route, profile)} min, passable for ${isFinite(best.survival) ? best.survival + " more min" : "the forecast period"}.`
    : `No safe route to ${shelter.name} at this time. Try another shelter.`;

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100 md:flex-row">
      <Sidebar shelterId={shelterId} onShelter={(id) => { setShelterId(id); setChosenId(null); }}
        results={results} activeId={active.route.id} bestId={best?.route.id} onSelect={setChosenId}
        hazards={hazards} reporting={reporting} onToggleReport={() => setReporting((r) => !r)} onClearHazards={() => setHazards([])}
        profileKey={profileKey} onProfile={setProfileKey} smsText={smsText} />
      <main className="relative min-h-0 flex-1">
        <MapView results={results} activeId={active.route.id} shelterId={shelterId} hazards={hazards} reporting={reporting}
          onReport={(pos) => { setHazards((h) => [...h, { id: Date.now(), pos }]); setReporting(false); }} t={t} />
        <TimeSlider t={t} onChange={(v) => { setPlaying(false); setT(v); }} timeline={timeline} playing={playing}
          onPlay={() => { if (t >= 120) setT(0); setPlaying((p) => !p); }} />
      </main>
    </div>
  );
}
