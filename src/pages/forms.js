import {
  config,
  product,
  system,
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
  icon,
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
// The enquiry is a callback lead. Technical sizing and pricing follow consultation.
export function quotePage(c, q) {
  const hp = q.interest === "hp";
  const context = selectedItems(c, q);
  return `<div class="container quote-page lead-page">${breadcrumb(c, [[c.t("Ajánlatkérés", "Request a quote")]])}
    <div class="quote-heading"><p class="eyebrow">${c.t("BESZÉLJÜK MEG AZ ELKÉPZELÉSED", "LET’S DISCUSS YOUR PLANS")}</p>
    <h1>${c.t("Segítünk megtalálni<br>a jó megoldást.", "Let’s find the right<br>solution for you.")}</h1>
    <p>${c.t("Írd meg, miben segíthetünk, és add meg az elérhetőséged. Telefonon egyeztetjük a részleteket, majd személyre szabott ajánlatot készítünk.", "Tell us what you need and how to reach you. We’ll discuss the details by phone, then prepare a tailored quote.")}</p></div>
    <div class="lead-layout"><section class="lead-form-panel">${q.complete ? completed(c, q) : `
      <form id="quote-form">
        <fieldset class="lead-interest"><legend id="step-title" tabindex="-1">${c.t("Miben segíthetünk?", "How can we help?")}</legend>
        <div class="option-grid">${[["ac", "Klíma", "Air conditioning"], ["hp", "Hőszivattyú", "Heat pump"]].map(([v,hu,en]) => `<label class="option"><input type="radio" name="interest" value="${v}" required ${q.interest === v ? "checked" : ""}><span>${c.t(hu,en)}</span></label>`).join("")}</div></fieldset>
        <div class="lead-basics fields-grid">
          ${field(c, {name:"roomCount",label:c.t("Hány helyiség? (opcionális)","Number of rooms (optional)"),type:"number",value:q.roomCount,required:false,extra:'min="1" max="100" step="1" inputmode="numeric"'})}
          ${field(c, {name:"area",label:hp ? c.t("Fűtendő alapterület, m² (opcionális)","Heated floor area, m² (optional)") : c.t("Helyiségek összterülete, m² (opcionális)","Total room area, m² (optional)"),type:"number",value:q.area,required:false,extra:'min="1" max="10000" step="0.1" inputmode="decimal"'})}
        </div>
        <p class="small lead-hint">${c.t("Ha még nem tudod a méreteket, nyugodtan hagyd üresen. A műszaki részleteket a beszélgetés során tisztázzuk.", "Not sure about the sizes? Leave these fields blank. We’ll discuss the technical details together.")}</p>
        <h2 class="lead-contact-title">${c.t("Hogyan érhetünk el?", "How can we reach you?")}</h2>
        <div class="fields-grid">
        ${field(c,{name:"contact.name",label:c.t("Név", "Name"),value:q.contact.name,extra:'autocomplete="name" minlength="2" maxlength="100"'})}
        ${field(c,{name:"contact.phone",label:c.t("Telefonszám", "Phone number"),type:"tel",value:q.contact.phone,extra:'autocomplete="tel" pattern="[+0-9 ()-]{7,25}" maxlength="25"'})}
        ${field(c,{name:"contact.email",label:c.t("Email", "Email"),type:"email",value:q.contact.email,extra:'autocomplete="email" maxlength="254"'})}
        ${field(c,{name:"contact.city",label:c.t("Település", "Town / city"),value:q.contact.city,extra:'autocomplete="address-level2" maxlength="100"'})}
        </div>
        <label class="field"><span>${c.t("Megjegyzés (opcionális)", "Notes (optional)")}</span><textarea name="note" rows="3" maxlength="3000" placeholder="${c.t("Például: három szobába keresek klímát, fűtésre is.", "For example: air conditioning for three rooms, with heating too.")}">${e(q.note)}</textarea></label>
        <label class="consent"><input type="checkbox" name="contact.consent" required ${q.contact.consent ? "checked" : ""}><span>${c.t("Elolvastam az", "I have read the")} <a href="${c.url("adatkezeles")}" target="_blank" rel="noopener">${c.t("adatkezelési tájékoztatót", "privacy information")}</a>, ${c.t("és hozzájárulok, hogy a Thermova az érdeklődésemmel kapcsolatban megkeressen.", "and consent to Thermova contacting me about my enquiry.")}</span></label>
        <p id="form-error" class="form-error" role="alert" hidden></p>
        ${!config.quoteEndpoint ? `<p class="notice">${c.t("Előnézet: az űrlap még nincs bekötve a fogadó rendszerhez. Az adataidat nem küldjük el; az összefoglalót ellenőrizheted és letöltheted.", "Preview: this form is not connected to a receiving service yet. Your details are not sent; you can review and download the summary.")}</p>` : ""}
        <button class="button button-wide" type="submit">${config.quoteEndpoint ? c.t("Visszahívást kérek", "Request a callback") : c.t("Érdeklődés áttekintése", "Review enquiry")} ${arrow}</button>
        <p class="small lead-hint">${c.t("Kötelezettségmentes érdeklődés. Konkrét ajánlatot az egyeztetés után adunk.", "No-obligation enquiry. Your quote follows a personal consultation.")}</p>
      </form>`}</section>
      <aside class="lead-aside"><p class="eyebrow">${c.t("MI TÖRTÉNIK EZUTÁN?", "WHAT HAPPENS NEXT?")}</p><ol class="lead-next">${[
        [c.t("Felhívunk.","We call you."),c.t("Átbeszéljük az igényeidet és a helyszín adottságait.","We discuss your needs and the property.")],
        [c.t("Segítünk választani.","We help you choose."),c.t("Közösen kiválasztjuk a megfelelő készüléket vagy rendszert.","Together we select the right equipment or system.")],
        [c.t("Ajánlatot készítünk.","We prepare your quote."),c.t("Az egyeztetett műszaki tartalomra, átlátható tételekkel.","Based on the agreed technical scope, with clear pricing.")]
      ].map(([title,body],i)=>`<li><span>0${i+1}</span><div><h3>${title}</h3><p>${body}</p></div></li>`).join("")}</ol>
      ${context ? `<div class="lead-context"><h3>${c.t("Erről érdeklődsz", "Your selection")}</h3>${context}<p class="small">${c.t("A kiválasztott termékeket továbbvisszük az egyeztetésre. Ez még nem megrendelés.", "Your selections are included for consultation. This is not an order.")}</p></div>` : ""}
      <p class="lead-review">${c.t("Több klímánál és minden hőszivattyús rendszernél szakember ellenőrzi a műszaki megoldást a végleges ajánlat előtt.", "A specialist reviews every multi-unit and heat-pump project before the final quote.")}</p></aside></div></div>`;
}
function selectedItems(c, q) {
  if (q.kind === "hp" && q.seed) {
    const p = system(q.system);
    return p ? `<p>${e(p.brand + " " + p.name)}</p>` : "";
  }
  if (!q.seed && !q.cartSignature && q.kind !== "device") return "";
  const lines = new Map();
  const add = (id, qty, installed) => {
    const p = product(id); if (!p) return;
    const key = id + ":" + installed;
    const current = lines.get(key);
    lines.set(key, {p, installed, qty:qty + (current?.qty || 0)});
  };
  q.units.forEach(u => add(u.pid, 1, q.kind !== "device"));
  (q.deviceOnly || []).forEach(i => add(i.id, i.qty, false));
  return [...lines.values()].map(({p,qty,installed})=>`<p><strong>${qty} × ${e(p.brand + " " + p.name)}</strong><br><span>${installed ? c.t("Alapszereléssel", "With standard installation") : c.t("Szerelés nélkül", "Without installation")}</span></p>`).join("");
}
function completed(c, q) {
  return `<div class="completion"><p class="eyebrow">${q.sent ? c.t("ELKÜLDVE", "SENT") : c.t("ELŐNÉZET · NINCS ELKÜLDVE", "PREVIEW · NOT SENT")}</p>
    <h2 id="step-title" tabindex="-1">${q.sent ? c.t("Köszönjük a megkeresést!", "Thank you for your enquiry!") : c.t("Az érdeklődés összefoglalója", "Your enquiry summary")}</h2>
    <p>${q.sent ? c.t("Megkaptuk az érdeklődésed. A megadott telefonszámon keresünk az egyeztetéshez.", "We received your enquiry. We’ll call the number you provided to discuss the details.") : c.t("Az összefoglaló elkészült. Ez az előnézet nem küld adatokat a Thermovának, és nem indít visszahívást.", "Your summary is ready. This preview does not send data to Thermova or arrange a callback.")}</p>
    <dl class="review-details"><div><dt>${c.t("Érdeklődés", "Interest")}</dt><dd>${q.interest === "hp" ? c.t("Hőszivattyú", "Heat pump") : c.t("Klíma", "Air conditioning")}</dd></div>
    <div><dt>${c.t("Kapcsolat", "Contact")}</dt><dd>${e(q.contact.name)}<br>${e(q.contact.phone)}${q.contact.email ? `<br>${e(q.contact.email)}` : ""}</dd></div>
    <div><dt>${c.t("Település", "Location")}</dt><dd>${e(q.contact.city)}</dd></div>
    ${q.roomCount || q.area ? `<div><dt>${c.t("Alapadatok", "Basic details")}</dt><dd>${q.roomCount ? `${e(q.roomCount)} ${c.t("helyiség", "rooms")}` : ""}${q.area ? ` · ${e(q.area)} m²` : ""}</dd></div>` : ""}
    ${q.note ? `<div><dt>${c.t("Megjegyzés", "Notes")}</dt><dd>${e(q.note)}</dd></div>` : ""}</dl>
    ${!q.sent ? `<button class="button" data-action="download-quote">${c.t("Összefoglaló letöltése", "Download enquiry summary")} ${icon("download")}</button><button class="text-button button-with-icon" data-action="edit-quote">${icon("back")} ${c.t("Adatok szerkesztése", "Edit details")}</button>` : ""}</div>`;
}
