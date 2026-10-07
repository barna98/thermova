import { config, climateBrands, heatPumpBrands } from "../site-data.js";
import { arrow, breadcrumb, image, helpBanner, installBlock } from "../components.js";
import { escape as e } from "../i18n.js";

function brandList(c, items, kind) {
  const ac = kind === "ac";
  return `<div class="brand-logo-grid brand-logo-grid-${kind}">${items.map((item) => {
    const href = `${c.url(ac ? "ajanlat" : "rendszer-ajanlat")}?brand=${encodeURIComponent(item.name)}`;
    const asset = item.asset;
    const mark = asset
      ? `<img src="/assets/brands/${asset}" alt="${e(item.name)}" loading="lazy" decoding="async">`
      : `<span class="brand-wordmark">${e(item.name)}</span>`;
    return `<a class="brand-logo-card brand-logo-card-simple" href="${href}" aria-label="${e(item.name)} – ${c.t("ajánlatkérés", "request a quote")}">
      <span class="brand-logo-mark">${mark}</span>
      <strong>${e(item.name)}</strong>
    </a>`;
  }).join("")}</div>`;
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
        ["cooling", c.t("Mindennapi hűtés", "Everyday cooling"), c.t("Megbízható komfort lakásba, házba vagy irodába.", "Reliable comfort for a flat, house or office.")],
        ["quiet", c.t("Csendes klíma hálószobába", "Quiet AC for bedrooms"), c.t("Alacsony beltéri zajszinttel, nyugodt éjszakákhoz.", "Low indoor sound levels for restful nights.")],
        ["heating", c.t("Fűtésre is alkalmas", "Suitable for heating too"), c.t("Átmeneti időszakra vagy rendszeresebb téli használatra.", "For shoulder seasons or more regular winter use.")],
        ["premium", c.t("Prémium komfort", "Premium comfort"), c.t("Halk működés, jobb hatásfok és fejlettebb levegőkezelés.", "Quiet operation, higher efficiency and advanced air treatment.")],
      ].map(([need, title, body]) => `<a class="choice-category-card choice-category-card-simple" href="${c.url("ajanlat")}?need=${need}" aria-label="${title} – ${c.t("ajánlatkérés", "request a quote")}"><h3>${title}</h3><p>${body}</p></a>`).join("")}</div>
    </section>
    <section class="section brand-offer"><div class="brand-offer-heading"><div><p class="eyebrow">${c.t("MÁRKÁK, AMELYEKKEL DOLGOZUNK", "BRANDS WE WORK WITH")}</p><h2>${c.t("Több gyártó.<br>Egy szakmai szűrő.", "Several brands.<br>One professional filter.")}</h2></div><p>${c.t("Válassz márkát, ha van preferenciád. Az egyeztetés után 2–3, az igényeidhez és a helyiséghez illő lehetőséget küldünk.", "Choose a brand if you have a preference. After consultation, we send two or three options suited to your needs and room.")}</p></div>
      ${brandList(c, climateBrands, "ac")}
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
        [c.t("Új építés vagy korszerűsítés", "New build or renovation"), c.t("Más rendszer illik egy új, jól szigetelt házhoz és más egy meglévő épülethez.", "A new insulated home and an existing building need different systems.")],
        [c.t("Hőleadók és hőigény", "Emitters and heat demand"), c.t("Padlófűtés, radiátor vagy fan-coil alapján méretezünk.", "We size around underfloor heating, radiators or fan coils.")],
        [c.t("Fűtés, hűtés és melegvíz", "Heating, cooling and hot water"), c.t("A kívánt funkciókat egy rendszerben hangoljuk össze.", "We coordinate the required functions in one system.")],
      ].map(([title, body]) => `<article><h3>${title}</h3><p>${body}</p></article>`).join("")}</div>
    </section>
    <section class="section brand-offer"><div class="brand-offer-heading"><div><p class="eyebrow">${c.t("MÁRKÁK ÉS RENDSZERMEGOLDÁSOK", "BRANDS AND SYSTEM SOLUTIONS")}</p><h2>${c.t("A megfelelő rendszer<br>az épületből indul ki.", "The right system<br>starts with the building.")}</h2></div><p>${c.t("Válassz márkát, ha van preferenciád. A végleges rendszert és ajánlatot minden esetben személyes egyeztetés és műszaki méretezés után állítjuk össze.", "Choose a brand if you have a preference. We define the final system and quote after consultation and technical sizing.")}</p></div>
      ${brandList(c, heatPumpBrands, "hp")}
    </section>
    <section class="help-banner"><div><p class="eyebrow">${c.t("ELSŐ LÉPÉS", "FIRST STEP")}</p><h2>${c.t("Néhány adatból<br>elindítjuk a tervezést.", "A few details<br>start the design process.")}</h2><p>${c.t("Add meg az épület alapterületét, a jelenlegi hőtermelőt, a hőleadókat és a kívánt funkciókat. Dokumentum feltöltése opcionális.", "Tell us the floor area, current heat source, emitters and required functions. Document upload is optional.")}</p></div><a class="button button-light" href="${c.url("rendszer-ajanlat")}">${c.t("Ajánlatot kérek", "Request a quote")} ${arrow}</a></section>
  </div>`;
}
