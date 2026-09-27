import { products, heatpumps } from "./catalogue.js";
export const config = Object.freeze({
  installationPrice: 109000,
  catalogueIsSample: false,
  quoteEndpoint: null,
  siteOrigin: "https://thermova.hu",
});
export const product = (id) => products.find((p) => p.id === id);
export const system = (id) => heatpumps.find((p) => p.id === id);
export function filterProducts(filters = {}) {
  let list = products.filter(
    (p) =>
      (!filters.size ||
        (+filters.size >= p.room[0] && +filters.size <= p.room[1])) &&
      (!filters.mode ||
        filters.mode === "cool" ||
        (filters.mode === "both" && p.mode !== "cool") ||
        (filters.mode === "heat" && p.mode === "heat")) &&
      (!filters.brand || p.brand === filters.brand) &&
      (!filters.price ||
        (filters.price === "low"
          ? p.price < 250000
          : filters.price === "mid"
            ? p.price >= 250000 && p.price <= 400000
            : p.price > 400000)) &&
      (!filters.q ||
        `${p.brand} ${p.name}`.toLowerCase().includes(filters.q.toLowerCase())),
  );
  return list.sort((a, b) =>
    filters.sort === "price-up"
      ? a.price - b.price
      : filters.sort === "price-down"
        ? b.price - a.price
        : filters.sort === "quiet"
          ? a.db - b.db
          : Number(b.badge === "rec") - Number(a.badge === "rec") ||
            a.price - b.price,
  );
}
export function recommendations(f) {
  return filterProducts(f).slice(0, 3);
}
export function totals(units, deviceOnly = []) {
  const device =
    units.reduce((n, u) => n + (product(u.pid)?.price || 0), 0) +
    deviceOnly.reduce(
      (n, item) => n + (product(item.id)?.price || 0) * item.qty,
      0,
    );
  const installation = units.length * config.installationPrice;
  return { device, installation, total: device + installation };
}
export function cartTotals(cart) {
  const device = cart.reduce(
    (n, item) => n + (product(item.id)?.price || 0) * item.qty,
    0,
  );
  const installedCount = cart.reduce(
    (n, item) => n + (item.installation ? item.qty : 0),
    0,
  );
  const installation = installedCount * config.installationPrice;
  return { device, installation, installedCount, total: device + installation };
}
export const cartKey = (item) =>
  `${item.id}:${item.installation ? "installed" : "unit"}`;
export function reviewRequired(q) {
  const count =
    q.units.length + (q.deviceOnly || []).reduce((n, item) => n + item.qty, 0);
  if (q.kind === "device") return count >= 2;
  return (
    q.kind === "hp" ||
    count >= 2 ||
    q.units.some(
      (u) =>
        u.height !== "under3" ||
        u.access !== "easy" ||
        ["roof", "unknown"].includes(u.outdoor),
    )
  );
}
export const newUnit = (pid = "gree-pulse-pro-35") => ({
  pid,
  size: "",
  property: "",
  floor: "",
  balcony: "",
  outdoor: "",
  height: "",
  access: "",
});
export const newQuote = (kind = "ac", pid) => ({
  kind,
  interest: kind === "hp" ? "hp" : "ac",
  roomCount: "",
  sent: false,
  step: 1,
  units: [newUnit(pid)],
  deviceOnly: [],
  system: kind === "hp" ? pid || "nordiq-aqua-8" : "",
  project: "",
  area: "",
  emitter: "",
  source: "",
  functions: [],
  note: "",
  files: [],
  contact: {
    zip: "",
    city: "",
    name: "",
    email: "",
    phone: "",
    consent: false,
  },
  complete: false,
});
export function safeCart(value) {
  if (!Array.isArray(value)) return [];
  const unique = new Map();
  value
    .filter(
      (x) =>
        product(x.id) &&
        Number.isInteger(x.qty) &&
        x.qty > 0 &&
        x.qty <= 20,
    )
    .forEach((x) => {
      const item = {
        id: x.id,
        qty: x.qty,
        installation: x.installation === true,
      };
      const key = cartKey(item);
      unique.set(key, {
        ...item,
        qty: Math.min(20, (unique.get(key)?.qty || 0) + item.qty),
      });
    });
  return [...unique.values()];
}
export const installationItems = [
  [
    "Kiszállás és a készülék helyszínre juttatása",
    "Travel and delivery of the unit",
  ],
  [
    "Max. 3 m hűtőköri cső, rézcső és szigetelés",
    "Up to 3 m refrigerant pipework, copper and insulation",
  ],
  [
    "Összekötő kábelezés és kondenzvízcső",
    "Interconnecting wiring and condensate pipe",
  ],
  [
    "450 mm-es kültéri konzol és rögzítőanyagok",
    "450 mm outdoor bracket and mounting materials",
  ],
  ["1 normál faláttörés", "One standard wall penetration"],
  [
    "Beltéri és kültéri egység felszerelése",
    "Installation of the indoor and outdoor units",
  ],
  ["Gravitációs kondenzvíz-elvezetés", "Gravity condensate drainage"],
  ["Vákuumozás", "Vacuum evacuation"],
  [
    "Elektromos betáp meglévő aljzathoz max. 5 m-ig",
    "Power connection to an existing socket, up to 5 m",
  ],
  ["Beüzemelés és próbaüzem", "Commissioning and test operation"],
  ["Dokumentáció és takarítás", "Documentation and clean-up"],
];

export function leadPayload(q, lang) {
  const hasSelection = Boolean(q.seed || q.cartSignature || q.kind === "device");
  return {
    schemaVersion: 2, locale: lang, interest: q.interest,
    contact: { ...q.contact }, roomCount: q.roomCount, area: q.area, note: q.note,
    selection: hasSelection ? { kind: q.kind, units: q.kind === "hp" ? [] : q.units, deviceOnly: q.deviceOnly, system: q.kind === "hp" ? q.system : null } : null,
    humanTechnicalReviewRequired: q.interest === "hp" || Number(q.roomCount) >= 2 || (hasSelection && reviewRequired(q)),
  };
}
