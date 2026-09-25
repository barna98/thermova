import { products } from "../catalogue.js";
import {
  config,
  product,
  system,
  totals,
  reviewRequired,
  recommendations,
} from "../domain.js";
import { escape as e, modes } from "../i18n.js";
import {
  arrow,
  field,
  breadcrumb,
  productCard,
  sampleNotice,
  image,
  productAsset,
} from "../components.js";
export function selector(c, filters = null) {
  return `<div class="container narrow">${breadcrumb(c, [[c.t("Klímaválasztó", "AC finder")]])}<section class="page-intro"><p class="eyebrow">${c.t("KLÍMAVÁLASZTÓ", "AC FINDER")}</p><h1>${c.t("Segítünk<br>klímát választani.", "Find the right<br>air conditioner.")}</h1><p>${c.t("Három kérdés. Csak azokat a modelleket mutatjuk, amelyek megfelelnek a válaszaidnak.", "Three questions. We’ll only show models that match your answers.")}</p></section><form id="selector-form" class="selector-form">${[
    [
      "size",
      c.t("Mekkora a helyiség?", "How large is your room?"),
      [
        ["15", c.t("10–18 m² · Kis szoba", "10–18 m² · Small room")],
        ["22", "18–25 m²"],
        ["30", "25–35 m²"],
        ["42", "35–50 m²"],
      ],
    ],
    [
      "mode",
      c.t("Mire használnád?", "What will you use it for?"),
      Object.entries(modes).map(([k, v]) => [k, c.t(...v)]),
    ],
    [
      "price",
      c.t(
        "Mekkora a készülékre szánt keret?",
        "What is your budget for the unit?",
      ),
      [
        ["low", c.t("250 000 Ft alatt", "Under 250,000 HUF")],
        ["mid", "250 000–400 000 " + c.t("Ft", "HUF")],
        ["high", c.t("400 000 Ft felett", "Over 400,000 HUF")],
      ],
    ],
  ]
    .map(
      ([name, title, opts], i) =>
        `<fieldset><legend><span>0${i + 1}</span>${title}</legend><div class="option-grid">${opts.map(([v, l]) => `<label class="option"><input type="radio" name="${name}" value="${v}" required ${filters?.[name] === v ? "checked" : ""}><span>${l}</span></label>`).join("")}</div></fieldset>`,
    )
    .join(
      "",
    )}<button class="button" type="submit">${c.t("Mutassátok a lehetőségeket", "Show my options")} ${arrow}</button><p class="small">${c.t("Az ajánlás tájékoztató. Az épület adottságai befolyásolják a méretezést.", "Recommendations are indicative. Building conditions affect sizing.")}</p></form></div><section id="selector-results" class="container section" tabindex="-1">${filters ? selectorResults(c, filters) : ""}</section>`;
}
export function selectorResults(c, filters) {
  const list = recommendations(filters);
  return `<p class="eyebrow">${c.t("A VÁLASZAID ALAPJÁN", "BASED ON YOUR ANSWERS")}</p><h2>${list.length ? c.t("A feltételeknek megfelelő klímák", "Air conditioners matching your requirements") : c.t("Nem találtunk megfelelő klímát.", "No matching air conditioner found.")}</h2>${list.length ? `<div class="product-grid">${list.map((p) => productCard(c, p)).join("")}</div>${sampleNotice(c)}` : `<p>${c.t("Nincs minden feltételnek megfelelő modell. Nem ajánlunk helyette rosszul méretezett készüléket.", "There is no model matching every requirement. We won’t suggest an incorrectly sized unit instead.")}</p><a class="button" href="${c.url("ajanlat")}">${c.t("Egyedi segítséget kérek", "Ask for individual advice")} ${arrow}</a>`}`;
}
const choices = (c, arr) => arr.map(([v, hu, en]) => [v, c.t(hu, en)]);
function unitFields(c, u, i, step) {
  const prefix = `units.${i}.`;
  const f = (name, label, options, extra = "") =>
    field(c, {
      name: prefix + name,
      label,
      value: u[name],
      options: options ? choices(c, options) : undefined,
      type: name === "size" ? "number" : "text",
      extra,
    });
  return `<fieldset class="room-block"><legend>${c.t("Helyiség", "Room")} ${i + 1}</legend>${
    step === 1
      ? `<div class="fields-grid">${field(c, { name: prefix + "pid", label: c.t("Kiválasztott készülék", "Selected unit"), value: u.pid, options: products.map((p) => [p.id, p.brand + " " + p.name]) })}${f("size", c.t("Helyiségméret (m²)", "Room size (m²)"), null, 'min="5" max="300" inputmode="decimal"')}${f(
          "property",
          c.t("Ingatlantípus", "Property type"),
          [
            ["house", "Családi ház", "House"],
            ["apartment", "Lakás", "Apartment"],
            ["business", "Üzleti ingatlan", "Business property"],
          ],
        )}${
          u.property === "apartment"
            ? `${f("floor", c.t("Emelet", "Floor"), null, 'inputmode="numeric" maxlength="12"')}${f(
                "balcony",
                c.t("Erkély / loggia", "Balcony / loggia"),
                [
                  ["yes", "Van", "Available"],
                  ["no", "Nincs", "None"],
                  ["unknown", "Még nem tudom", "Not sure yet"],
                ],
              )}`
            : ""
        }</div>`
      : `<div class="fields-grid">${f(
          "outdoor",
          c.t(
            "Kültéri egység lehetséges helye",
            "Possible outdoor unit location",
          ),
          [
            ["wall", "Homlokzat", "Facade"],
            ["balcony", "Erkély / loggia", "Balcony / loggia"],
            ["ground", "Talajszint", "Ground level"],
            ["roof", "Tető", "Roof"],
            ["unknown", "Szakmai segítséget kérek", "I need advice"],
          ],
        )}${f("height", c.t("Munkamagasság", "Working height"), [
          ["under3", "Legfeljebb 3 m", "Up to 3 m"],
          ["over3", "3 m felett", "Over 3 m"],
          ["unknown", "Nem tudom", "Not sure"],
        ])}${f("access", c.t("Megközelíthetőség", "Accessibility"), [
          ["easy", "Könnyen megközelíthető", "Easily accessible"],
          ["difficult", "Nehezen megközelíthető", "Difficult access"],
          ["unknown", "Egyeztetést igényel", "Needs assessment"],
        ])}</div>`
  }${step === 1 && i > 0 ? `<button class="text-button" type="button" data-action="remove-unit" data-index="${i}">${c.t("Helyiség eltávolítása", "Remove room")}</button>` : ""}</fieldset>`;
}
function uploads(c, q, hp = false) {
  return `<div class="upload-box"><span class="upload-plus" aria-hidden="true">+</span><h3>${hp ? c.t("Tervrajz, energetikai dokumentum", "Plans or energy documents") : c.t("Mutasd meg a helyszínt", "Show us the space")}</h3><p>${c.t("Opcionális. Később is egyeztethetjük a részleteket.", "Optional. We can discuss the details later.")}</p><label class="button button-outline upload-label">${c.t("Fájlok kiválasztása", "Choose files")}<input class="file-input" name="files" type="file" multiple accept="${hp ? ".pdf,.jpg,.jpeg,.png,.webp" : "image/jpeg,image/png,image/webp"}"></label><small>${hp ? "PDF, JPG, PNG, WebP" : "JPG, PNG, WebP"} · ${c.t("legfeljebb 6 fájl, egyenként 10 MB", "up to 6 files, 10 MB each")}</small></div><ul class="file-list">${q.files.map((f, i) => `<li><span>${e(f.name)} <small>(${(f.size / 1024 / 1024).toFixed(1)} MB)</small></span><button type="button" class="text-button" data-action="remove-file" data-index="${i}" aria-label="${e(c.t("Eltávolítás: ", "Remove: ") + f.name)}">×</button></li>`).join("")}</ul><label class="field"><span>${c.t("Megjegyzés (opcionális)", "Notes (optional)")}</span><textarea name="note" rows="4" maxlength="3000" placeholder="${c.t("Bármi, amit érdemes tudnunk a helyszínről…", "Anything we should know about your property…")}">${e(q.note)}</textarea></label>`;
}
function contact(c, q) {
  const v = q.contact;
  return `<div class="fields-grid">${field(c, { name: "contact.zip", label: c.t("Irányítószám", "Postal code"), value: v.zip, extra: 'inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="postal-code"' })}${field(c, { name: "contact.city", label: c.t("Település", "Town / city"), value: v.city, extra: 'autocomplete="address-level2" maxlength="100"' })}${field(c, { name: "contact.name", label: c.t("Teljes név", "Full name"), value: v.name, extra: 'autocomplete="name" minlength="2" maxlength="100"' })}${field(c, { name: "contact.email", label: "Email", type: "email", value: v.email, extra: 'autocomplete="email" maxlength="254"' })}${field(c, { name: "contact.phone", label: c.t("Telefonszám", "Phone number"), type: "tel", value: v.phone, extra: 'autocomplete="tel" pattern="[+0-9 ()-]{7,25}" maxlength="25"' })}</div><label class="consent"><input type="checkbox" name="contact.consent" required ${v.consent ? "checked" : ""}><span>${c.t("Elolvastam az", "I have read the")} <a href="${c.url("adatkezeles")}" target="_blank" rel="noopener">${c.t("adatkezelési tájékoztatót", "privacy information")}</a>, ${c.t("és hozzájárulok az adataim ajánlatkérési célú kezeléséhez.", "and consent to my details being used for this quote request.")}</span></label><p class="notice">${c.t("Ebben a bemutatóban nem továbbítjuk az adataidat. A következő lépésben átnézheted és letöltheted az ajánlatkérés összefoglalóját.", "This preview does not transmit your data. Next, you can review and download your request summary.")}</p>`;
}
export function quotePage(c, q) {
  const hp = q.kind === "hp",
    device = q.kind === "device",
    p = hp
      ? system(q.system)
      : product(q.units[0]?.pid) || product("nordiq-35"),
    step = q.step;
  const steps = device
    ? [c.t("Kapcsolat", "Contact")]
    : hp
      ? [
          c.t("Az épület", "Your building"),
          c.t("A rendszer", "Your system"),
          c.t("Igények", "Requirements"),
          c.t("Kapcsolat", "Contact"),
        ]
      : [
          c.t("A helyiségek", "Your rooms"),
          c.t("A telepítés", "Installation"),
          c.t("Fotók", "Photos"),
          c.t("Kapcsolat", "Contact"),
        ];
  const labels = hp
    ? [
        [c.t("Az épület adatai", "Building details")],
        [
          c.t(
            "A meglévő fűtés adatai",
            "What system are we connecting to?",
          ),
        ],
        [c.t("Mire van szükséged?", "What do you need?")],
        [c.t("Hogyan érhetünk el?", "How can we reach you?")],
      ]
    : [
        [c.t("Hová kerül a klíma?", "Where will it make you comfortable?")],
        [
          c.t(
            "Nézzük a telepítés feltételeit.",
            "Let’s look at the installation.",
          ),
        ],
        [c.t("Fotók és megjegyzések", "A picture can help.")],
        [c.t("Hogyan érhetünk el?", "How can we reach you?")],
      ];
  let content = "";
  if (device || step === 4) content = contact(c, q);
  else if (!hp && step < 3)
    content =
      q.units.map((u, i) => unitFields(c, u, i, step)).join("") +
      (step === 1
        ? `<button type="button" class="button button-outline" data-action="add-unit">+ ${c.t("Még egy helyiség", "Add another room")}</button>`
        : "");
  else if (!hp) content = uploads(c, q);
  else if (step === 1)
    content = `<div class="fields-grid">${field(c, {
      name: "project",
      label: c.t("Projekt típusa", "Project type"),
      value: q.project,
      options: choices(c, [
        ["new", "Új építés", "New build"],
        ["renovation", "Korszerűsítés", "Renovation"],
      ]),
    })}${field(c, { name: "area", label: c.t("Fűtött alapterület (m²)", "Heated floor area (m²)"), type: "number", value: q.area, extra: 'min="20" max="5000"' })}</div>`;
  else if (step === 2)
    content = `<div class="fields-grid">${field(c, {
      name: "emitter",
      label: c.t("Hőleadók", "Heat emitters"),
      value: q.emitter,
      options: choices(c, [
        ["floor", "Padlófűtés", "Underfloor heating"],
        ["radiator", "Radiátor", "Radiators"],
        ["fan-coil", "Fan-coil", "Fan coils"],
        ["mixed", "Vegyes rendszer", "Mixed system"],
        ["unknown", "Még nem tudom", "Not sure yet"],
      ]),
    })}${field(c, {
      name: "source",
      label: c.t("Jelenlegi hőtermelő", "Current heat source"),
      value: q.source,
      options: choices(c, [
        ["gas", "Gázkazán", "Gas boiler"],
        ["electric", "Elektromos fűtés", "Electric heating"],
        ["solid", "Vegyes tüzelés", "Solid fuel"],
        ["pump", "Hőszivattyú", "Heat pump"],
        ["none", "Még nincs / új építés", "None / new build"],
        ["other", "Egyéb", "Other"],
      ]),
    })}</div>`;
  else
    content = `<fieldset class="function-options"><legend>${c.t("Kívánt funkciók (legalább egy)", "Required functions (at least one)")}</legend><div class="option-grid">${[
      ["heat", "Fűtés", "Heating"],
      ["cool", "Hűtés", "Cooling"],
      ["dhw", "Használati melegvíz", "Domestic hot water"],
    ]
      .map(
        ([v, hu, en]) =>
          `<label class="option"><input type="checkbox" name="functions" value="${v}" ${q.functions.includes(v) ? "checked" : ""}><span>${c.t(hu, en)}</span></label>`,
      )
      .join("")}</div></fieldset>${uploads(c, q, true)}`;
  const total = totals(q.units, q.deviceOnly);
  return `<div class="container quote-page">${breadcrumb(c, [[c.t("Ajánlatkérés", "Quote request")]])}<div class="quote-heading"><p class="eyebrow">${hp ? c.t("HŐSZIVATTYÚS RENDSZER", "HEAT PUMP SYSTEM") : c.t("AJÁNLATKÉRÉS", "REQUEST A QUOTE")}</p><h1>${hp ? c.t("Ajánlatkérés<br>hőszivattyúra", "Request a heat pump quote") : device ? c.t("Készülékigény egyeztetése.", "Discuss your unit request.") : c.t("Ajánlatkérés<br>klímatelepítésre", "Request an AC installation quote")}</h1></div><ol class="stepper" aria-label="${c.t("Ajánlatkérés lépései", "Quote request steps")}">${steps.map((label, i) => `<li ${i === (device ? 0 : step - 1) ? 'aria-current="step"' : ""} class="${i < (device ? 0 : step - 1) ? "done" : ""}"><span>${String(i + 1).padStart(2, "0")}</span>${label}</li>`).join("")}</ol><div class="quote-layout"><section class="quote-form-panel">${q.complete ? completed(c, q) : `<h2 id="step-title" tabindex="-1">${device ? c.t("Hogyan érhetünk el?", "How can we reach you?") : labels[step - 1][0]}</h2><p class="small">${step === 3 && !hp ? c.t("A fotó soha nem kötelező. Nyugodtan továbbléphetsz nélküle.", "Photos are never required. You can continue without them.") : c.t("A *-gal jelölt mezők szükségesek az egyeztetéshez.", "Fields marked * are required for the consultation.")}</p><form id="quote-form">${content}<p id="form-error" class="form-error" role="alert" hidden></p><div class="form-navigation">${step > 1 && !device ? `<button class="text-button" type="button" data-action="quote-back">← ${c.t("Vissza", "Back")}</button>` : "<span></span>"}<button class="button" type="submit">${step === 4 || device ? c.t("Ajánlatkérés áttekintése", "Review request") : step === 3 && !hp ? c.t("Tovább a kapcsolathoz", "Continue to contact") : c.t("Tovább", "Continue")} <span aria-hidden="true">→</span></button></div></form>`}</section><aside class="quote-summary"><p class="eyebrow">${c.t("AZ AJÁNLATKÉRÉS TARTALMA", "YOUR REQUEST")}</p>${image(hp ? "system" : productAsset(p), c.t("Márkázott látványkép", "Branded concept image"), { small: true })}${q.deviceOnly?.length ? `<p class="small">${q.deviceOnly.reduce((n, item) => n + item.qty, 0)} ${c.t("további készülék szerelés nélkül is az igény része.", "additional unit(s) without installation are included in your request.")}</p>` : ""}<h2>${hp ? p.brand + " " + p.name : device ? c.t("Készülékigény", "Unit request") : q.units.length === 1 ? p.brand + " " + p.name : q.units.length + " " + c.t("klíma, több helyiséghez", "units for multiple rooms")}</h2>${hp ? `<p>${c.t("Tájékoztató rendszerár", "Indicative system price")}</p><strong>${c.money(p.price)}</strong>` : `<dl><div><dt>${c.t("Készülékek", "Units")}</dt><dd>${c.money(total.device)}</dd></div>${!device ? `<div><dt>${c.t("Standard telepítés", "Standard installation")} × ${q.units.length}</dt><dd>${c.money(total.installation)}</dd></div>` : ""}<div class="summary-total"><dt>${c.t("Tájékoztató összeg", "Indicative total")}</dt><dd>${c.money(device ? total.device : total.total)}</dd></div></dl>`}<p class="small">${c.t("Bruttó árak, minta készülékadatok alapján.", "Prices include VAT, based on sample product data.")}</p><p class="summary-note">${hp ? c.t("Minden hőszivattyús projekt emberi műszaki validációt igényel.", "Every heat pump project requires human technical validation.") : q.units.length + (q.deviceOnly || []).reduce((n, item) => n + item.qty, 0) >= 2 ? c.t("Két vagy több klíma esetén a végleges ajánlat előtt mindig emberi ellenőrzés szükséges.", "Two or more units always require human review before a final quote.") : c.t("A végleges műszaki tartalmat és árat egyeztetjük veled.", "We will agree the final technical scope and price with you.")}</p>${!hp && !device ? `<a href="${c.url("telepites")}" target="_blank" rel="noopener">${c.t("Mit tartalmaz a telepítés?", "What is included in installation?")} ${arrow}</a>` : ""}</aside></div></div>`;
}
function completed(c, q) {
  const review = reviewRequired(q);
  return `<div class="completion"><p class="eyebrow">${c.t("ELŐKÉSZÍTVE", "READY TO REVIEW")}</p><h2 id="step-title" tabindex="-1">${c.t("Az ajánlatkérés összefoglalója", "Your request summary")}</h2><p>${c.t("Az összefoglaló elkészült. Ez a bemutató nem küld adatokat a Thermovának, és nem hoz létre megrendelést.", "Your summary is ready. This preview does not send data to Thermova or create an order.")}</p><dl class="review-details"><div><dt>${c.t("Kapcsolat", "Contact")}</dt><dd>${e(q.contact.name)}<br>${e(q.contact.email)}<br>${e(q.contact.phone)}</dd></div><div><dt>${c.t("Település", "Location")}</dt><dd>${e(q.contact.zip)} ${e(q.contact.city)}</dd></div><div><dt>${c.t("Fájlok", "Files")}</dt><dd>${q.files.length} ${c.t("kiválasztva", "selected")}</dd></div></dl>${review ? `<p class="notice">${c.t("A végleges ajánlat előtt emberi műszaki ellenőrzés szükséges.", "Human technical review is required before a final quote.")}</p>` : ""}<button class="button" data-action="download-quote">${c.t("Összefoglaló letöltése", "Download request summary")} ↓</button><p class="small">${c.t("A JSON-fájl tartalmazza a megadott adatokat. A kiválasztott mellékleteket külön őrizd meg; a letöltés csak a fájlneveiket tartalmazza.", "The JSON file contains your entered details. Keep selected attachments separately; the download includes only their names.")}</p><button class="text-button" data-action="edit-quote">← ${c.t("Adatok szerkesztése", "Edit details")}</button></div>`;
}
