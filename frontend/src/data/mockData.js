// SAMPLE DATA. Coordinates are approximate. Replace with backend (OSRM + flood model) responses.
// floodsAt = minutes from now when that segment becomes impassable (null = no flood forecast).
export const CENTER = [31.634, 74.872];
export const START = { name: "You are here", pos: [31.6405, 74.859] };

const mk = (id, name, pts, floodsAt, km, mins) => ({
  id, name, km, mins,
  segments: pts.slice(1).map((p, i) => ({
    path: [pts[i], p],
    eta: Math.round(((i + 1) / (pts.length - 1)) * mins),
    floodsAt: floodsAt[i] ?? Infinity,
  })),
});
const S = START.pos;

export const SHELTERS = [
  {
    id: "gndu", name: "GNDU campus shelter", pos: [31.6358, 74.824], capacity: 800, occupied: 310,
    routes: [
      mk("gndu-fast", "Fastest (low-lying road)", [S, [31.638, 74.85], [31.637, 74.84], [31.6362, 74.83], [31.6358, 74.824]], [null, 70, 38, null], 4.2, 16),
      mk("gndu-safe", "Northern bypass", [S, [31.648, 74.852], [31.647, 74.838], [31.641, 74.828], [31.6358, 74.824]], [null, null, null, 150], 5.6, 22),
    ],
  },
  {
    id: "ranjit", name: "Ranjit Avenue relief camp", pos: [31.6525, 74.865], capacity: 400, occupied: 360,
    routes: [
      mk("ranjit-direct", "Direct road", [S, [31.645, 74.862], [31.6525, 74.865]], [45, 28], 1.9, 9),
      mk("ranjit-ring", "Ring road", [S, [31.6405, 74.87], [31.648, 74.874], [31.6525, 74.865]], [], 3.1, 14),
    ],
  },
];

// Illustrative flood zones: radius (m) = r0 + growth * minutes. Replace with the ML model's output.
export const FLOODS = [
  { pos: [31.637, 74.84], r0: 250, growth: 12 },
  { pos: [31.649, 74.8625], r0: 200, growth: 10 },
];
// Share of evacuees expected on each route (%). Replace with the load-balancing output.
export const CROWD = { "gndu-fast": 80, "gndu-safe": 30, "ranjit-direct": 90, "ranjit-ring": 35 };
