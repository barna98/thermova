export const config = Object.freeze({
  installationPrice: 109000,
  quoteEndpoint: "/.netlify/functions/send-quote",
  quoteProvider: "netlify-function",
  quoteFormName: "thermova-ajanlat",
  siteOrigin: "https://thermova.hu",
});

export const contactDetails = Object.freeze({
  email: "info@thermova.hu",
  phones: [
    { display: "+36 30 914 2183", href: "+36309142183" },
    { display: "+36 70 675 7028", href: "+36706757028" },
  ],
});

export const climateBrands = Object.freeze([
  { name: "AUX", asset: "aux.svg" },
  { name: "Daikin", asset: "daikin.svg" },
  { name: "Gree", asset: "gree.svg" },
  { name: "Haier", asset: "haier.svg" },
  { name: "Hisense", asset: "hisense.svg" },
  { name: "TCL", asset: "tcl.svg" },
  { name: "Tesla", asset: "tesla.png" },
]);

export const heatPumpBrands = Object.freeze([
  { name: "Daikin", asset: "daikin.svg" },
  { name: "Panasonic", asset: "panasonic.svg" },
  { name: "LG", asset: "lg.svg" },
  { name: "Bosch", asset: "bosch.svg" },
  { name: "Vaillant", asset: "vaillant.svg" },
]);

export const installationItems = [
  ["Kiszállás és a készülék helyszínre juttatása", "Travel and delivery of the unit"],
  ["Max. 3 m hűtőköri cső, rézcső és szigetelés", "Up to 3 m refrigerant pipework, copper and insulation"],
  ["Összekötő kábelezés és kondenzvízcső", "Interconnecting wiring and condensate pipe"],
  ["450 mm-es kültéri konzol és rögzítőanyagok", "450 mm outdoor bracket and mounting materials"],
  ["1 normál faláttörés", "One standard wall penetration"],
  ["Beltéri és kültéri egység felszerelése", "Installation of the indoor and outdoor units"],
  ["Gravitációs kondenzvíz-elvezetés", "Gravity condensate drainage"],
  ["Vákuumozás", "Vacuum evacuation"],
  ["Elektromos betáp meglévő aljzathoz max. 5 m-ig", "Power connection to an existing socket, up to 5 m"],
  ["Beüzemelés és próbaüzem", "Commissioning and test operation"],
  ["Dokumentáció és takarítás", "Documentation and clean-up"],
];

export const newQuote = (kind = "ac") => ({
  kind,
  interest: kind === "hp" ? "hp" : "ac",
  roomCount: "",
  area: "",
  note: "",
  sent: false,
  complete: false,
  seed: null,
  contextKey: "",
  contact: { city: "", name: "", email: "", phone: "", consent: false },
});

export function leadPayload(q, lang) {
  return {
    schemaVersion: 3,
    locale: lang,
    interest: q.interest,
    contact: { ...q.contact },
    roomCount: q.roomCount,
    area: q.area,
    note: q.note,
    selection: null,
    humanTechnicalReviewRequired: q.interest === "hp" || Number(q.roomCount) >= 2,
  };
}
