import { config, climateBrands } from "../site-data.js";
import { escape as e, modes } from "../i18n.js";
import { arrow, field, breadcrumb, icon } from "../components.js";
export function selector(c, filters = null) {
  const brands = ["", ...climateBrands.map((item) => item.name)];
  const questions = [
    ["size", c.t("Mekkora a helyiség?", "How large is the room?"), [["15", c.t("10–18 m² · kis szoba", "10–18 m² · small room")], ["22", "18–25 m²"], ["30", "25–35 m²"], ["42", "35–50 m²"]]],
    ["room", c.t("Milyen helyiségbe kerül?", "What type of room is it for?"), [["bedroom", c.t("Hálószoba", "Bedroom")], ["living", c.t("Nappali", "Living room")], ["office", c.t("Iroda vagy üzlet", "Office or shop")], ["other", c.t("Más helyiség", "Other room")]]],
    ["mode", c.t("Mire használnád?", "How will you use it?"), Object.entries(modes).map(([key, value]) => [key, c.t(...value)])],
    ["noise", c.t("Mennyire fontos a halk működés?", "How important is quiet operation?"), [["silent", c.t("Nagyon fontos · hálószobába", "Very important · bedroom")], ["quiet", c.t("Fontos · halk működést szeretnék", "Important · I prefer quiet operation")], ["any", c.t("Nem elsődleges szempont", "Not a priority")]]],
    ["budget", c.t("Milyen szintű megoldást keresel?", "What level of solution are you looking for?"), [["value", c.t("Kedvezőbb, megbízható alapmegoldás", "Reliable, more affordable solution")], ["balanced", c.t("Kiegyensúlyozott ár és tudás", "Balanced price and features")], ["premium", c.t("Prémium komfort és hatásfok", "Premium comfort and efficiency")], ["open", c.t("Nyitott vagyok a javaslatra", "I am open to recommendations")]]],
  ];
  return `<div class="container selector-shell">${breadcrumb(c, [[c.t("Klímaválasztó", "AC finder")]])}
    <section class="selector-intro page-intro"><div><p class="eyebrow">${c.t("SZEMÉLYRE SZABOTT IGÉNYFELMÉRÉS", "PERSONALISED NEEDS ASSESSMENT")}</p><h1>${c.t("Mondd el, mire<br>van szükséged.", "Tell us what<br>you need.")}</h1><p>${c.t("Néhány gyakorlati kérdéssel pontosítjuk az igényeidet. Ezután add meg az elérhetőséged, mi pedig egyeztetés után 2–3 megfelelő lehetőséget küldünk.", "A few practical questions help us understand your needs. Then share your contact details and, after consultation, we send two or three suitable options.")}</p></div><div class="selector-promise"><strong>${c.t("Mit veszünk figyelembe?", "What do we consider?")}</strong><span>${c.t("helyiség és méret", "room and size")}</span><span>${c.t("hűtés vagy fűtés", "cooling or heating")}</span><span>${c.t("beltéri zajszint", "indoor sound level")}</span><span>${c.t("komfortszint és márka", "comfort level and brand")}</span></div></section>
    <form id="selector-form" class="selector-form selector-form-expanded">${questions.map(([name, title, options]) => `<fieldset><legend>${title}</legend><div class="option-grid">${options.map(([value, label]) => `<label class="option"><input type="radio" name="${name}" value="${value}" required ${filters?.[name] === value ? "checked" : ""}><span>${label}</span></label>`).join("")}</div></fieldset>`).join("")}
      <fieldset><legend>${c.t("Van preferált márkád?", "Do you prefer a brand?")}</legend><label class="field selector-brand"><select name="brand"><option value="">${c.t("Nincs márkapreferenciám", "No brand preference")}</option>${brands.filter(Boolean).map((brand) => `<option value="${e(brand)}" ${filters?.brand === brand ? "selected" : ""}>${e(brand)}</option>`).join("")}</select></label></fieldset>
      <div class="selector-submit"><button class="button" type="submit">${c.t("Tovább az ajánlatkéréshez", "Continue to enquiry")} ${arrow}</button><p>${c.t("A válaszaid alapján felhívunk, pontosítjuk a részleteket, majd 2–3 megfelelő készüléket és személyre szabott ajánlatot küldünk.", "We call to confirm the details, then send two or three suitable units in a tailored quote.")}</p></div>
    </form></div>`;
}

// The enquiry is a callback lead. Technical sizing and pricing follow consultation.
export function quotePage(c, q) {
  const hp = q.interest === "hp";
  return `<div class="container quote-page lead-page">${breadcrumb(c, [[c.t("Ajánlatkérés", "Request a quote")]])}
    <div class="quote-heading"><p class="eyebrow">${c.t("BESZÉLJÜK MEG AZ ELKÉPZELÉSED", "LET’S DISCUSS YOUR PLANS")}</p>
    <h1>${c.t("Segítünk megtalálni<br>a jó megoldást.", "Let’s find the right<br>solution for you.")}</h1>
    <p>${c.t("Írd meg, miben segíthetünk, és add meg az elérhetőséged. Telefonon egyeztetjük a részleteket, majd személyre szabott ajánlatot készítünk.", "Tell us what you need and how to reach you. We’ll discuss the details by phone, then prepare a tailored quote.")}</p></div>
    <div class="lead-layout"><section class="lead-form-panel">${q.complete ? completed(c, q) : `
      <form id="quote-form" name="${config.quoteFormName}" method="POST" action="/" data-netlify="true" data-netlify-honeypot="bot-field" accept-charset="UTF-8">
        <input type="hidden" name="form-name" value="${config.quoteFormName}">
        <input type="hidden" name="locale" value="${c.lang}">
        <input type="hidden" name="human-technical-review-required" value="${hp ? "true" : "false"}">
        <p class="form-honeypot" aria-hidden="true"><label>Ne töltsd ki ezt a mezőt: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
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
        <button class="button button-wide" type="submit">${c.t("Visszahívást kérek", "Request a callback")} ${arrow}</button>
        <p class="small lead-hint">${c.t("Kötelezettségmentes érdeklődés. Konkrét ajánlatot az egyeztetés után adunk.", "No-obligation enquiry. Your quote follows a personal consultation.")}</p>
        <noscript><p class="small lead-hint">${c.t("Az űrlap JavaScript nélkül is elküldhető; sikeres küldés után a főoldal jelenik meg.", "The form can also be submitted without JavaScript; after a successful submission, the home page is shown.")}</p></noscript>
      </form>`}</section>
      <aside class="lead-aside"><p class="eyebrow">${c.t("MI TÖRTÉNIK EZUTÁN?", "WHAT HAPPENS NEXT?")}</p><ul class="lead-next">${[
        [c.t("Felhívunk.","We call you."),c.t("Átbeszéljük az igényeidet és a helyszín adottságait.","We discuss your needs and the property.")],
        [c.t("Segítünk választani.","We help you choose."),c.t("Közösen kiválasztjuk a megfelelő készüléket vagy rendszert.","Together we select the right equipment or system.")],
        [c.t("Ajánlatot készítünk.","We prepare your quote."),c.t("Az egyeztetett műszaki tartalomra, átlátható tételekkel.","Based on the agreed technical scope, with clear pricing.")]
      ].map(([title,body])=>`<li><div><h3>${title}</h3><p>${body}</p></div></li>`).join("")}</ul>
      <p class="lead-review">${c.t("Több klímánál és minden hőszivattyús rendszernél szakember ellenőrzi a műszaki megoldást a végleges ajánlat előtt.", "A specialist reviews every multi-unit and heat-pump project before the final quote.")}</p></aside></div></div>`;
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
