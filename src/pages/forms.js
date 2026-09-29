import {
  config,
  product,
  system,
  reviewRequired,
  recommendations,
} from "../domain.js";
import { escape as e, modes } from "../i18n.js";
import { products } from "../catalogue.js";
import {
  arrow,
  field,
  breadcrumb,
  recommendationCard,
  sampleNotice,
  icon,
} from "../components.js";
export function selector(c, filters = null) {
  const brands = ["", ...new Set(products.map((p) => p.brand))];
  const questions = [
    ["size", c.t("Mekkora a helyiség?", "How large is the room?"), [["15", c.t("10–18 m² · kis szoba", "10–18 m² · small room")], ["22", "18–25 m²"], ["30", "25–35 m²"], ["42", "35–50 m²"]]],
    ["mode", c.t("Mire használnád?", "How will you use it?"), Object.entries(modes).map(([key, value]) => [key, c.t(...value)])],
    ["noise", c.t("Mennyire fontos a halk működés?", "How important is quiet operation?"), [["silent", c.t("Nagyon fontos · hálószobába", "Very important · bedroom")], ["quiet", c.t("Fontos · legfeljebb 25 dB(A)", "Important · up to 25 dB(A)")], ["any", c.t("Nem elsődleges szempont", "Not a priority")]]],
    ["price", c.t("Mekkora a készülékre szánt keret?", "What is your budget for the unit?"), [["low", c.t("250 000 Ft alatt", "Under 250,000 HUF")], ["mid", "250 000–400 000 " + c.t("Ft", "HUF")], ["high", c.t("400 000 Ft felett", "Over 400,000 HUF")]]],
    ["tier", c.t("Milyen szintű megoldást keresel?", "What level of solution are you looking for?"), [["any", c.t("Nyitott vagyok a javaslatra", "I am open to recommendations")], ["value", c.t("Kedvező árú, jó alapfunkciókkal", "Good value with the essentials")], ["rec", c.t("Kiegyensúlyozott ár és tudás", "Balanced price and features")], ["premium", c.t("Prémium komfort és hatásfok", "Premium comfort and efficiency")]]],
  ];
  return `<div class="container selector-shell">${breadcrumb(c, [[c.t("Klímaválasztó", "AC finder")]])}
    <section class="selector-intro page-intro"><div><p class="eyebrow">${c.t("SZEMÉLYRE SZABOTT KLÍMAVÁLASZTÓ", "PERSONALISED AC FINDER")}</p><h1>${c.t("Kevesebb keresgélés.<br>Jobb találatok.", "Less browsing.<br>Better matches.")}</h1><p>${c.t("Válaszolj néhány gyakorlati kérdésre. A végén legfeljebb három olyan készüléket mutatunk, amely megfelel a megadott szempontoknak, tájékoztató árakkal.", "Answer a few practical questions. We then show up to three units that match your criteria, with indicative prices.")}</p></div><div class="selector-promise"><strong>${c.t("Mit veszünk figyelembe?", "What do we consider?")}</strong><span>${c.t("helyiségméret", "room size")}</span><span>${c.t("hűtés vagy fűtés", "cooling or heating")}</span><span>${c.t("beltéri zajszint", "indoor sound level")}</span><span>${c.t("ár és felszereltség", "price and features")}</span></div></section>
    <form id="selector-form" class="selector-form selector-form-expanded">${questions.map(([name, title, options], index) => `<fieldset><legend><span>${String(index + 1).padStart(2, "0")}</span>${title}</legend><div class="option-grid">${options.map(([value, label]) => `<label class="option"><input type="radio" name="${name}" value="${value}" required ${filters?.[name] === value ? "checked" : ""}><span>${label}</span></label>`).join("")}</div></fieldset>`).join("")}
      <fieldset><legend><span>06</span>${c.t("Van preferált márkád?", "Do you prefer a brand?")}</legend><label class="field selector-brand"><select name="brand"><option value="">${c.t("Nincs márkapreferenciám", "No brand preference")}</option>${brands.filter(Boolean).map((brand) => `<option value="${e(brand)}" ${filters?.brand === brand ? "selected" : ""}>${e(brand)}</option>`).join("")}</select></label></fieldset>
      <div class="selector-submit"><button class="button" type="submit">${c.t("Mutassátok a lehetőségeket", "Show my options")} ${arrow}</button><p>${c.t("Az ajánlás tájékoztató. A végleges méretezést a helyszín adottságai alapján ellenőrizzük.", "Recommendations are indicative. Final sizing is checked against site conditions.")}</p></div>
    </form></div><section id="selector-results" class="container section selector-results" tabindex="-1">${filters ? selectorResults(c, filters) : ""}</section>`;
}


export function selectorResults(c, filters) {
  const list = recommendations(filters);
  return `<div class="results-heading"><div><p class="eyebrow">${c.t("A VÁLASZAID ALAPJÁN", "BASED ON YOUR ANSWERS")}</p><h2>${list.length ? c.t("Ezek illenek legjobban az igényeidhez.", "These best match your needs.") : c.t("Nincs minden feltételnek megfelelő modell.", "No model matches every criterion.")}</h2></div>${list.length ? `<p>${c.t("Az árak tájékoztató jellegűek, a végleges ajánlatot az egyeztetés után adjuk.", "Prices are indicative; the final quote follows consultation.")}</p>` : ""}</div>${list.length ? `<div class="recommendation-grid">${list.map((p) => recommendationCard(c, p)).join("")}</div>${sampleNotice(c)}` : `<div class="empty-state"><p>${c.t("Nem lazítjuk automatikusan a fontos feltételeidet. Kérj személyes segítséget, és együtt megtaláljuk a megfelelő megoldást.", "We do not automatically relax your important requirements. Ask for personal guidance and we will find the right solution together.")}</p><a class="button" href="${c.url("ajanlat")}">${c.t("Személyes segítséget kérek", "Ask for personal guidance")} ${arrow}</a></div>`}`;
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
      ].map(([title,body])=>`<li><div><h3>${title}</h3><p>${body}</p></div></li>`).join("")}</ol>
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
