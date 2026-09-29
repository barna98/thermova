import { products, heatpumps } from "../catalogue.js";
import { config } from "../domain.js";
import { arrow, breadcrumb, image, helpBanner, installBlock, sampleNotice } from "../components.js";
import { escape as e } from "../i18n.js";

function summaries(items) {
  return [...new Set(items.map((item) => item.brand))]
    .map((brand) => {
      const models = items.filter((item) => item.brand === brand);
      return { brand, count: models.length, from: Math.min(...models.map((item) => item.price)) };
    })
    .sort((a, b) => a.brand.localeCompare(b.brand, "hu"));
}

function brandList(c, items, kind) {
  const ac = kind === "ac";
  return `<div class="brand-service-list">${summaries(items).map((item) => `<article class="brand-service-row">
    <div><span class="brand-monogram" aria-hidden="true">${e(item.brand.slice(0, 1))}</span><div><h3>${e(item.brand)}</h3><p>${item.count} ${c.t(ac ? "választható klímamodell" : "tervezhető rendszer", ac ? "available air conditioner models" : "system options")}</p></div></div>
    <div class="brand-starting-price"><span>${c.t(ac ? "Készülékkel és alapszereléssel" : "Tájékoztató rendszerár", ac ? "Unit with standard installation" : "Indicative system price")}</span><strong>${c.t("már", "from")} ${c.money(item.from + (ac ? config.installationPrice : 0))}</strong></div>
  </article>`).join("")}</div>`;
}

export function catalogue(c) {
  return `<div class="container">${breadcrumb(c, [[c.t("Klímák", "Air conditioning")]])}
    <section class="service-hero page-intro"><div><p class="eyebrow">${c.t("KLÍMA ÉS SZAKSZERŰ TELEPÍTÉS", "AIR CONDITIONING AND INSTALLATION")}</p>
      <h1>${c.t("Komfort a helyiséghez<br>és az igényeidhez méretezve.", "Comfort sized for<br>your room and needs.")}</h1>
      <p>${c.t("Nem kell több tucat készüléket végignézned. Mondd el, hol és hogyan használnád a klímát, mi pedig leszűkítjük a valóban megfelelő lehetőségeket.", "You do not need to browse dozens of units. Tell us where and how you would use it, and we narrow the choice to suitable options.")}</p>
      <div class="hero-actions"><a class="button" href="${c.url("valaszto")}">${c.t("Segítsetek választani", "Help me choose")} ${arrow}</a><a class="text-link" href="${c.url("ajanlat")}">${c.t("Ajánlatot kérek", "Request a quote")} ${arrow}</a></div></div>
      <figure class="service-hero-media">${image("interior", c.t("Világos nappali klímával", "Bright living room with air conditioning"), { hero: true })}<figcaption><span>${c.t("ALAPSZERELÉS", "STANDARD INSTALLATION")}</span><strong>${c.money(config.installationPrice)}</strong></figcaption></figure>
    </section>
    <section class="section choice-categories"><div class="section-head"><div><p class="eyebrow">${c.t("MIRE VAN SZÜKSÉGED?", "WHAT DO YOU NEED?")}</p><h2>${c.t("Könnyen érthető<br>választási szempontok.", "Clear criteria<br>for an easier choice.")}</h2></div></div>
      <div class="choice-category-grid">${[
        ["01", c.t("Mindennapi hűtés", "Everyday cooling"), c.t("Megbízható komfort lakásba, házba vagy irodába.", "Reliable comfort for a flat, house or office.")],
        ["02", c.t("Csendes klíma hálószobába", "Quiet AC for bedrooms"), c.t("Alacsony beltéri zajszinttel, nyugodt éjszakákhoz.", "Low indoor sound levels for restful nights.")],
        ["03", c.t("Fűtésre is alkalmas", "Suitable for heating too"), c.t("Átmeneti időszakra vagy rendszeresebb téli használatra.", "For shoulder seasons or more regular winter use.")],
        ["04", c.t("Prémium komfort", "Premium comfort"), c.t("Halk működés, jobb hatásfok és fejlettebb levegőkezelés.", "Quiet operation, higher efficiency and advanced air treatment.")],
      ].map(([n, title, body]) => `<article><span>${n}</span><h3>${title}</h3><p>${body}</p></article>`).join("")}</div>
    </section>
    <section class="section brand-offer"><div class="brand-offer-heading"><div><p class="eyebrow">${c.t("MÁRKÁK ÉS INDULÓ ÁRAK", "BRANDS AND STARTING PRICES")}</p><h2>${c.t("Több gyártó.<br>Egy szakmai szűrő.", "Several brands.<br>One professional filter.")}</h2></div><p>${c.t("Az induló ár az adott márka jelenlegi legkedvezőbb készülékárát és a 109 000 Ft-os standard telepítést tartalmazza.", "The starting price combines the brand’s current lowest unit price with standard installation at 109,000 HUF.")}</p></div>
      ${brandList(c, products, "ac")}
      ${sampleNotice(c)}
    </section>
    <div class="help-section">${helpBanner(c)}</div>
    ${installBlock(c)}
  </div>`;
}

export function hpCatalogue(c) {
  return `<div class="container">${breadcrumb(c, [[c.t("Hőszivattyúk", "Heat pumps")]])}
    <section class="service-hero page-intro"><div><p class="eyebrow">${c.t("HŐSZIVATTYÚS RENDSZEREK", "HEAT PUMP SYSTEMS")}</p>
      <h1>${c.t("Az épülethez tervezett<br>fűtés, hűtés és melegvíz.", "Heating, cooling and hot water<br>designed for the building.")}</h1>
      <p>${c.t("A hőszivattyú nem polcról levehető termék. Az épület, a hőleadók és a kívánt funkciók alapján állítjuk össze a teljes rendszert, majd műszakilag validáljuk.", "A heat pump is not an off-the-shelf product. We design and technically validate the complete system around the building, emitters and required functions.")}</p>
      <div class="hero-actions"><a class="button" href="${c.url("rendszer-ajanlat")}">${c.t("Rendszerajánlatot kérek", "Request a system quote")} ${arrow}</a><a class="text-link" href="${c.url("ajanlat")}">${c.t("Segítséget kérek", "Ask for guidance")} ${arrow}</a></div></div>
      <figure class="service-hero-media">${image("system", c.t("Hőszivattyús rendszer látványképe", "Heat pump system concept"), { hero: true })}<figcaption><span>${c.t("MINDEN PROJEKT", "EVERY PROJECT")}</span><strong>${c.t("műszaki ellenőrzéssel", "technically reviewed")}</strong></figcaption></figure>
    </section>
    <section class="section hp-process"><div class="section-head"><div><p class="eyebrow">${c.t("MIBŐL INDULUNK KI?", "WHAT DO WE CONSIDER?")}</p><h2>${c.t("Nem csak teljesítményt<br>választunk.", "We choose more<br>than capacity.")}</h2></div></div>
      <div class="choice-category-grid">${[
        ["01", c.t("Új építés vagy korszerűsítés", "New build or renovation"), c.t("Más rendszer illik egy új, jól szigetelt házhoz és más egy meglévő épülethez.", "A new insulated home and an existing building need different systems.")],
        ["02", c.t("Hőleadók és hőigény", "Emitters and heat demand"), c.t("Padlófűtés, radiátor vagy fan-coil alapján méretezünk.", "We size around underfloor heating, radiators or fan coils.")],
        ["03", c.t("Fűtés, hűtés és melegvíz", "Heating, cooling and hot water"), c.t("A kívánt funkciókat egy rendszerben hangoljuk össze.", "We coordinate the required functions in one system.")],
      ].map(([n, title, body]) => `<article><span>${n}</span><h3>${title}</h3><p>${body}</p></article>`).join("")}</div>
    </section>
    <section class="section brand-offer"><div class="brand-offer-heading"><div><p class="eyebrow">${c.t("RENDSZEREK ÉS INDULÓ ÁRAK", "SYSTEMS AND STARTING PRICES")}</p><h2>${c.t("Tájékozódási pont<br>a tervezés előtt.", "A starting point<br>before design.")}</h2></div><p>${c.t("Az összegek tájékoztató rendszerárak. A végleges műszaki tartalmat és árat minden esetben személyes egyeztetés és méretezés után adjuk meg.", "Prices are indicative system prices. Final scope and pricing always follow consultation and technical sizing.")}</p></div>
      ${brandList(c, heatpumps, "hp")}
      ${sampleNotice(c)}
    </section>
    <section class="help-banner"><div><p class="eyebrow">${c.t("ELSŐ LÉPÉS", "FIRST STEP")}</p><h2>${c.t("Néhány adatból<br>elindítjuk a tervezést.", "A few details<br>start the design process.")}</h2><p>${c.t("Add meg az épület alapterületét, a jelenlegi hőtermelőt, a hőleadókat és a kívánt funkciókat. Dokumentum feltöltése opcionális.", "Tell us the floor area, current heat source, emitters and required functions. Document upload is optional.")}</p></div><a class="button button-light" href="${c.url("rendszer-ajanlat")}">${c.t("Ajánlatot kérek", "Request a quote")} ${arrow}</a></section>
  </div>`;
}
