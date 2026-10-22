const R = 6371000;
const rad = (x) => (x * Math.PI) / 180;
const dist = ([a, b], [c, d]) => {
  const h = Math.sin(rad(c - a) / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const nearHazard = (seg, h) => {
  const [p, q] = seg.path;
  return [p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], q].some((x) => dist(x, h.pos) < 500);
};

// speed = trip-time multiplier vs. car; buffer = extra minutes of flood margin required
export const PROFILES = {
  car: { label: "Car", speed: 1, buffer: 0 },
  walk: { label: "On foot", speed: 3, buffer: 0 },
  wheelchair: { label: "Wheelchair", speed: 4, buffer: 10 },
  ambulance: { label: "Ambulance", speed: 0.7, buffer: 0 },
};
export const tripMins = (route, p) => Math.round(route.mins * p.speed);

// A segment is judged at t + eta: when you actually reach it, at your travel speed.
export function evaluate(route, t, hazards = [], p = PROFILES.car) {
  const segs = route.segments.map((s) => {
    const eta = Math.round(s.eta * p.speed);
    const left = s.floodsAt - (t + eta) - p.buffer;
    const hit = hazards.some((h) => nearHazard(s, h));
    return { ...s, status: hit || left <= 0 ? "blocked" : left < 15 ? "risky" : "clear" };
  });
  const blocked = segs.some((s) => s.status === "blocked");
  const risky = segs.some((s) => s.status === "risky");
  const survival = blocked ? 0 : Math.min(...route.segments.map((s) => s.floodsAt - Math.round(s.eta * p.speed))) - t - p.buffer;
  return { segs, blocked, risky, survival };
}

export const stateOf = (r) => (r.blocked ? "blocked" : r.risky ? "risky" : "clear");

export function pickBest(results) {
  const ok = results.filter((r) => !r.blocked);
  if (!ok.length) return null;
  return ok.sort((a, b) => b.survival - a.survival || a.route.mins - b.route.mins)[0];
}
