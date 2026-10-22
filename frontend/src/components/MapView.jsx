import { MapContainer, TileLayer, Polyline, Circle, CircleMarker, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CENTER, START, SHELTERS, FLOODS } from "../data/mockData";

const COLOR = { clear: "#34d399", risky: "#fbbf24", blocked: "#f87171" };

function ClickToReport({ enabled, onReport }) {
  useMapEvents({ click: (e) => enabled && onReport([e.latlng.lat, e.latlng.lng]) });
  return null;
}

export default function MapView({ results, activeId, shelterId, hazards, reporting, onReport, t }) {
  const ordered = [...results].sort((a, b) => (a.route.id === activeId) - (b.route.id === activeId));
  const dot = (fill) => ({ color: "#020617", weight: 3, fillColor: fill, fillOpacity: 1 });

  return (
    <div className="relative h-full w-full">
      {reporting && <div className="absolute left-1/2 top-3 z-[1000] -translate-x-1/2 rounded-lg bg-red-400 px-4 py-2 text-sm font-bold text-slate-950 shadow">Tap the road that is blocked</div>}
      <MapContainer center={CENTER} zoom={13} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors &copy; CARTO" subdomains="abcd"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <ClickToReport enabled={reporting} onReport={onReport} />

        {FLOODS.map((f, i) => (
          <Circle key={i} center={f.pos} radius={f.r0 + f.growth * t}
            pathOptions={{ color: "#38bdf8", weight: 1, fillColor: "#0ea5e9", fillOpacity: 0.28 }} />
        ))}

        {ordered.map((r) => {
          const on = r.route.id === activeId;
          return r.segs.map((s, i) => (
            <Polyline key={`${r.route.id}-${i}`} positions={s.path}
              pathOptions={on ? { color: COLOR[s.status], weight: 8, opacity: 0.95 } : { color: "#94a3b8", weight: 3, opacity: 0.5, dashArray: "6 8" }} />
          ));
        })}

        {SHELTERS.map((s) => (
          <CircleMarker key={s.id} center={s.pos} radius={s.id === shelterId ? 13 : 9} pathOptions={dot("#e2e8f0")}>
            <Tooltip permanent direction="top" offset={[0, -8]}>{s.name}</Tooltip>
          </CircleMarker>
        ))}
        <CircleMarker center={START.pos} radius={9} pathOptions={dot("#22d3ee")}><Tooltip direction="top">{START.name}</Tooltip></CircleMarker>
        {hazards.map((h) => (
          <CircleMarker key={h.id} center={h.pos} radius={11} pathOptions={dot("#f87171")}><Tooltip>Reported blocked</Tooltip></CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}