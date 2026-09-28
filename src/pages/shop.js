import { products, heatpumps } from "../catalogue.js";
import { config, filterProducts, product, system } from "../domain.js";
import { escape as e, modes } from "../i18n.js";
import {
  arrow,
  breadcrumb,
  image,
  sectionHead,
  productCard,
  productText,
  sampleNotice,
  installBlock,
  helpBanner,
  field,
  productAsset,
  productBadge,
  livingStory,
  brandGallery,
  icon,
} from "../components.js";
export function filtersForm(c, f = {}) {
  const activeCount = ["size", "mode", "price", "brand"].filter(
    (key) => f[key],
  ).length;
  const select = (name, label, opts) =>
    field(c, {
      name,
      label,
      value: f[name] || "",
      required: false,
      options: opts,
    });
  return `<form id="filters" class="filters"><button class="mobile-filter-toggle" type="button" data-action="filter-toggle" aria-expanded="false" aria-controls="filter-controls">${icon("tune")}<span>${c.t("Szűrés és rendezés", "Filter and sort")}</span><b class="filter-active-count" ${activeCount ? "" : "hidden"}>${activeCount}</b><span class="filter-toggle-mark" aria-hidden="true">+</span></button><div id="filter-controls" class="filter-controls"><div class="filter-heading"><h2>${c.t("Szűrés", "Filters")}</h2><button class="text-button" type="reset">${c.t("Törlés", "Clear")}</button></div>${select(
    "size",
    c.t("Helyiségméret", "Room size"),
    [
      ["15", "10–18 m²"],
      ["22", "18–25 m²"],
      ["30", "25–35 m²"],
      ["42", "35–50 m²"],
    ],
  )}${select(
    "mode",
    c.t("Mire használnád?", "How will you use it?"),
    Object.entries(modes).map(([k, v]) => [k, c.t(...v)]),
  )}${select("price", c.t("Készülékár", "Unit price"), [
    ["low", c.t("250 000 Ft alatt", "Under 250,000 HUF")],
    ["mid", "250 000–400 000 " + c.t("Ft", "HUF")],
    ["high", c.t("400 000 Ft felett", "Over 400,000 HUF")],
  ])}${select(
    "brand",
    c.t("Márka (opcionális)", "Brand (optional)"),
    [...new Set(products.map((p) => p.brand))].map((b) => [b, b]),
  )}<div class="filter-help"><span class="eyebrow">${c.t("BIZONYTALAN VAGY?", "NOT SURE?")}</span><p>${c.t("Útmutató a választáshoz elég három válasz.", "Three answers are all it takes.")}</p><a class="text-link" href="${c.url("valaszto")}">${c.t("Segítünk választani", "Let us help")} ${arrow}</a></div></div><noscript><p>${c.t("A szűréshez kapcsold be a JavaScriptet. Az összes termék alább elérhető.", "Enable JavaScript to filter. All products are available below.")}</p></noscript></form>`;
}
export function results(c, f = {}) {
  const list = filterProducts(f);
  const filterLabels = {
    size:
      ({ "15": "10–18 m²", "22": "18–25 m²", "30": "25–35 m²", "42": "35–50 m²" })[
        f.size
      ] || "",
    mode: f.mode && c.t(...modes[f.mode]),
    price:
      f.price === "low"
        ? c.t("250 000 Ft alatt", "Under 250,000 HUF")
        : f.price === "mid"
          ? c.t("250–400 ezer Ft", "250–400k HUF")
          : f.price === "high"
            ? c.t("400 000 Ft felett", "Over 400,000 HUF")
            : "",
    brand: f.brand || "",
  };
  const activeFilters = ["size", "mode", "price", "brand"].filter(
    (key) => f[key],
  );
  return `${activeFilters.length ? `<div class="active-filters" aria-label="${c.t("Aktív szűrők", "Active filters")}">${activeFilters.map((key) => `<button type="button" data-action="remove-filter" data-filter="${key}" aria-label="${e(c.t("Szűrő törlése: ", "Remove filter: ") + filterLabels[key])}"><span>${e(filterLabels[key])}</span>${icon("close")}</button>`).join("")}<button class="clear-filter-chip" type="button" data-action="clear-filters">${c.t("Mind törlése", "Clear all")}</button></div>` : ""}<div class="results-meta"><p role="status" aria-live="polite"><b>${list.length}</b> ${c.t("klíma a választásodhoz", "air conditioners for your selection")}</p><label>${c.t("Rendezés", "Sort")} <select name="sort" form="filters" aria-label="${c.t("Rendezés", "Sort")}">${[
    ["recommended", c.t("Ajánlott sorrend", "Recommended")],
    ["price-up", c.t("Ár: növekvő", "Price: low to high")],
    ["price-down", c.t("Ár: csökkenő", "Price: high to low")],
    ["quiet", c.t("Leghalkabb elöl", "Quietest first")],
  ]
    .map(
      ([v, label]) =>
        `<option value="${v}" ${f.sort === v ? "selected" : ""}>${label}</option>`,
    )
    .join(
      "",
    )}</select></label></div>${list.length ? `<div class="product-grid catalogue-grid">${list.map((p) => productCard(c, p)).join("")}</div>` : `<div class="empty-state"><h2>${c.t("Most nincs pontos találat.", "No exact matches this time.")}</h2><p>${c.t("Módosíts egy szűrőt, vagy kérj segítséget az egyedi igényedhez.", "Change a filter, or ask for help with your requirements.")}</p><button class="button button-outline" data-action="clear-filters">${c.t("Szűrők törlése", "Clear filters")}</button></div>`}`;
}
export function catalogue(c, f = {}) {
  return `<div class="container">${breadcrumb(c, [[c.t("Klímák", "Air conditioners")]])}<section class="page-intro catalogue-intro"><div><p class="eyebrow">${c.t("KÉSZÜLÉKEK ÉS ÁRAK", "UNITS AND PRICES")}</p><h1>${c.t("Klímák otthonra<br>és munkahelyre.", "Air conditioning<br>for home and work.")}</h1><p>${c.t("Találd meg a hozzád illő klímát. A készülék és a standard telepítés árát is azonnal látod.", "Find the right air conditioner. See both the unit and standard installation price at a glance.")}</p><a class="text-link" href="${c.url("valaszto")}">${c.t("Segítség a választáshoz", "Help me choose")} ${arrow}</a></div><figure class="catalogue-intro-media">${image("interior", c.t("Világos nappali THERMOVA klímával – enteriőr-látványkép", "Bright interior with THERMOVA air conditioning — concept image"), { hero: true })}<figcaption><span>THERMOVA / CLIMATE</span><strong>${c.t("Hűtés és fűtés, a helyiséghez választva.", "Cooling and heating selected for the room.")}</strong></figcaption></figure></section>${sampleNotice(c)}<div class="catalogue-layout">${filtersForm(c, f)}<section id="results" aria-label="${c.t("Termékek", "Products")}">${results(c, f)}</section></div>${helpBanner(c)}</div>`;
}
export function productPage(c, id, withInstallation = true) {
  const p = product(id);
  if (!p) return null;
  const yes =
    c.lang === "hu"
      ? p.yes
      : [
          `A ${p.room.join("–")} m² room`,
          p.mode === "heat"
            ? "Heating is your primary goal"
            : "You need cooling and seasonal comfort",
          "You want a carefully sized solution",
        ];
  const no =
    c.lang === "hu"
      ? p.no
      : [
          "Your room falls outside the suggested range",
          "Your building has unusual heat losses",
          "Your priorities require a different specification",
        ];
  return `<div class="container">${breadcrumb(c, [[c.t("Klímák", "Air conditioners"), "klimak"], [`${p.brand} ${p.name}`]])}<section class="product-detail"><div class="detail-visual"><span class="product-badge">${productBadge(c, p)}</span>${image(productAsset(p), `${p.brand} ${p.name} — ${c.t("termékfotó", "product image")}`, { hero: true })}</div><div class="detail-info"><p class="eyebrow">${e(p.brand)} / ${c.t("INVERTERES SPLIT KLÍMA", "INVERTER SPLIT AIR CONDITIONER")}</p><h1>${e(p.name)}</h1><p class="product-sku">${e(p.sku)}</p><p class="detail-position">${productText(c, p)}</p><dl class="spec-strip">${[
    [p.room.join("–") + " m²", c.t("Ajánlott méret", "Room size")],
    [p.kw + " kW", c.t("Hűtőteljesítmény", "Cooling capacity")],
    [p.cls, c.t("Energiaosztály", "Energy class")],
    [p.db + " dB(A)", c.t("Min. hangnyomás", "Min. sound pressure")],
  ]
    .map(([v, l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`)
    .join(
      "",
    )}</dl><div class="detail-prices"><div><span>${c.t("Csak a készülék · referenciaár", "Unit only · reference price")}</span><b>${c.money(p.price)}</b></div><div><span>${c.t("Standard telepítéssel · kalkulált", "With standard installation · calculated")}</span><strong>${c.money(p.price + config.installationPrice)}</strong></div><p>${c.t("Bruttó referenciaár. Telepítés: 109 000 Ft. Kábelcsatornázás külön. Végleges ár visszaigazolás után.", "Gross reference price. Installation: 109,000 HUF. Trunking is extra. Final price is subject to confirmation.")}</p></div><fieldset class="purchase-options"><legend>${c.t("Hogyan kéred?", "How would you like it?")}</legend><div class="purchase-choice-grid"><label class="purchase-choice"><input type="radio" name="purchase-installation" value="no" data-product="${p.id}" ${!withInstallation ? "checked" : ""}><span><b>${c.t("Csak a készülék", "Unit only")}</b><small>${c.money(p.price)}</small></span></label><label class="purchase-choice"><input type="radio" name="purchase-installation" value="yes" data-product="${p.id}" ${withInstallation ? "checked" : ""}><span><b>${c.t("Alapszereléssel", "With standard installation")}</b><small>+ ${c.money(config.installationPrice)}</small></span></label></div></fieldset><button class="button button-wide cart-primary" data-action="add-cart" data-id="${p.id}"><span id="cart-cta-label">${c.t("Kosárba teszem", "Add to bag")}</span><span class="cart-cta-price" id="selected-price">${c.money(p.price + (withInstallation ? config.installationPrice : 0))}</span>${arrow}</button><a class="quote-alternative" href="${c.url("ajanlat")}?product=${p.id}">${c.t("AJÁNLATOT KÉREK TELEPÍTÉSSEL", "GET A QUOTE WITH INSTALLATION")} ${arrow}</a><p class="small">${c.t("Kötelezettségmentes egyeztetés. Az ajánlat a helyszíni feltételektől függ.", "No-obligation consultation. Your quote depends on site conditions.")}</p></div></section>${sampleNotice(c)}<nav class="anchor-nav" aria-label="${c.t("Termék részletei", "Product details")}"><a href="#why">${c.t("Miért ezt?", "Why this one?")}</a><a href="#installation">${c.t("Telepítés", "Installation")}</a><a href="#specifications">${c.t("Műszaki adatok", "Specifications")}</a><a href="#alternatives">${c.t("Alternatívák", "Alternatives")}</a></nav><section class="section why-section" id="why"><div><p class="eyebrow">${c.t("SZAKMAI SZEMPONTOK", "A CONSIDERED RECOMMENDATION")}</p><h2>${c.t("Miért ajánlja<br>a Thermova?", "Why choose it<br>with Thermova?")}</h2><p>${c.t(p.why, "Capacity, sound level and how you use it all matter. These are the key considerations for this model.")}</p><p class="small">${c.t("Az alapterület tájékoztató. A tájolás, a szigetelés és az üvegfelületek módosíthatják a szükséges teljesítményt.", "Floor area is a guide. Orientation, insulation and glazing can change the capacity required.")}</p></div><div class="choice-columns"><div><h3>${c.t("Ezt válaszd, ha…", "Choose this if…")}</h3><ul>${yes.map((v) => `<li>${e(v)}</li>`).join("")}</ul></div><div><h3>${c.t("Más modellt választanánk, ha…", "We would choose another if…")}</h3><ul>${no.map((v) => `<li>${e(v)}</li>`).join("")}</ul></div></div></section><div class="benefit-grid">${[
    [
      c.t("Ajánlott helyiségméret", "Recommended room size"),
      p.room.join("–") + " m²",
    ],
    [
      c.t("Beltéri zajszint", "Indoor noise level"),
      p.db + " dB(A) " + c.t("min. hangnyomás", "min. sound pressure"),
    ],
    [
      c.t("Energiahatékonyság", "Energy efficiency"),
      p.cls + " " + c.t("energiaosztály", "energy class"),
    ],
    [
      c.t("Inverteres működés", "Inverter operation"),
      c.lang === "hu"
        ? p.features.slice(0, 2).join(" · ")
        : "Inverter control and connected functions",
    ],
    [c.t("Ajánlott használat", "Recommended use"), c.t(...modes[p.mode])],
    [
      c.t("Alapszerelés", "Transparent installation"),
      c.t("Tételes standard csomag", "Itemised standard package"),
    ],
  ]
    .map(
      ([title, desc]) => `<div><h3>${title}</h3><p>${desc}</p></div>`,
    )
    .join(
      "",
    )}</div>${installBlock(c, true)}${livingStory(c)}<section class="trust-note"><span class="eyebrow">THERMOVA</span><div><h2>${c.t("Telepítés és beüzemelés.", "Installation and commissioning.")}</h2><p>${c.t("Előre egyeztetett műszaki tartalom, dokumentált beüzemelés és rendezett átadás. A referenciafeltöltéshez csak valós, jóváhagyott projektek kerülhetnek ide.", "Agreed technical scope, documented commissioning and a tidy handover. Only real, approved projects will be added as references.")}</p></div></section><details class="specifications" id="specifications"><summary>${c.t("Műszaki adatok", "Technical specifications")}<span aria-hidden="true">+</span></summary><dl>${[
    [c.t("Modellkód", "Model code"), p.sku],
    [c.t("Hűtőteljesítmény", "Cooling capacity"), p.kw + " kW"],
    [
      c.t("Ajánlott helyiségméret", "Suggested room size"),
      p.room.join("–") + " m²",
    ],
    [c.t("Energiaosztály", "Energy class"), p.cls],
    ["SCOP", p.scop],
    [
      c.t("Minimum hangnyomásszint", "Minimum sound pressure level"),
      p.db + " dB(A)",
    ],
  ]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join(
      "",
    )}</dl></details><section class="section" id="alternatives">${sectionHead(c, c.t("ÉRDEMES ÖSSZEVETNI", "WORTH COMPARING"), c.t("További ajánlott klímák", "Other recommended air conditioners"))}<div class="product-grid">${products
    .filter(
      (x) => x.id !== p.id && x.room[0] <= p.room[1] && x.room[1] >= p.room[0],
    )
    .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, 3)
    .map((x) => productCard(c, x))
    .join(
      "",
    )}</div></section></div><div class="mobile-sticky"><div><small id="sticky-variant">${withInstallation ? c.t("Alapszereléssel", "With installation") : c.t("Csak készülék", "Unit only")}</small><strong id="sticky-price">${c.money(p.price + (withInstallation ? config.installationPrice : 0))}</strong></div><button class="button button-small" data-action="add-cart" data-id="${p.id}">${c.t("Kosárba", "Add to bag")} ${arrow}</button></div>`;
}
export function hpCatalogue(c) {
  return `<div class="container">${breadcrumb(c, [[c.t("Hőszivattyúk", "Heat pumps")]])}<section class="split-editorial page-intro"><div><p class="eyebrow">${c.t("FŰTÉS, HŰTÉS ÉS KORSZERŰSÍTÉS", "HEATING, COOLING AND RENOVATION")}</p><h1>${c.t("Hőszivattyús<br>rendszerek.", "Heat pump<br>systems.")}</h1><p>${c.t("Új épülethez vagy korszerűsítéshez keresel hőszivattyút? Az igényeid alapján fűtésre, megfelelő hőleadókkal hűtésre és használati melegvíz-készítésre is tervezünk rendszert.", "Looking for a heat pump for a new building or renovation? We design systems for heating, cooling with suitable emitters, and domestic hot water according to your needs.")}</p><a href="${c.url("rendszer-ajanlat")}" class="button">${c.t("Segítséget kérek a tervezéshez", "Help me plan my system")} ${arrow}</a></div>${image("system", c.t("Hőszivattyúrendszer látványképe", "Heat pump system concept"), { hero: true })}</section><p class="notice">${c.t("Minden hőszivattyús projekt emberi műszaki validációt igényel. A feltüntetett összegek tájékoztató rendszerárak, nem végleges ajánlatok.", "Every heat pump project requires technical validation by a specialist. Displayed amounts are indicative system prices, not final quotes.")}</p>${sampleNotice(c)}<div class="hp-grid">${heatpumps.map((p) => `<article class="hp-card">${image("system", c.t("Márkázott rendszer-látványkép", "Branded system concept"), { small: true })}<div><p class="eyebrow">${p.use === "new" ? c.t("ÚJ ÉPÍTÉSHEZ", "FOR NEW BUILDS") : p.use === "retrofit" ? c.t("KORSZERŰSÍTÉSHEZ", "FOR RENOVATION") : c.t("ÚJ ÉS MEGLÉVŐ ÉPÜLETEKHEZ", "FOR NEW AND EXISTING BUILDINGS")}</p><h2>${p.brand} ${p.name}</h2><p>${p.kw} kW <span class="divider">/</span> ${p.area.join("–")} m² <span class="divider">/</span> ${p.flow}</p><span class="small">${c.t("Tájékoztató rendszerár, bruttó", "Indicative system price, incl. VAT")}</span><strong class="hp-price">${c.money(p.price)}</strong><a class="text-link" href="${c.url("hoszivattyuk/" + p.id)}">${c.t("Megnézem a rendszert", "Explore the system")} ${arrow}</a></div></article>`).join("")}</div></div>`;
}
export function hpProduct(c, id) {
  const p = system(id);
  if (!p) return null;
  return `<div class="container">${breadcrumb(c, [[c.t("Hőszivattyúk", "Heat pumps"), "hoszivattyuk"], [p.brand + " " + p.name]])}<section class="product-detail"><div class="detail-visual">${image("system", c.t("THERMOVA márkázott rendszer-látványkép", "THERMOVA branded system concept"), { hero: true })}<p>${c.t("Márkázott rendszer-látványkép", "Branded system concept")}</p></div><div class="detail-info"><p class="eyebrow">${c.t("LEVEGŐ–VÍZ HŐSZIVATTYÚRENDSZER", "AIR-TO-WATER HEAT PUMP SYSTEM")}</p><h1>${p.brand}<br>${p.name}</h1><p>${c.t(p.tag, p.use === "new" ? "A complete system for a well-insulated new home." : p.use === "retrofit" ? "A considered starting point for upgrading an existing heating system." : "A complete approach to heating and hot water for your home.")}</p><dl class="spec-strip">${[
    [p.kw + " kW", c.t("Teljesítmény", "Capacity")],
    [p.area.join("–") + " m²", c.t("Tájékoztató méret", "Indicative area")],
    [p.flow, c.t("Előremenő", "Flow temperature")],
    [p.fn.length, c.t("Funkció", "Functions")],
  ]
    .map(([v, l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`)
    .join(
      "",
    )}</dl><div class="detail-prices"><span>${c.t("Tájékoztató rendszerár, bruttó", "Indicative system price, incl. VAT")}</span><strong>${c.money(p.price)}</strong><p>${c.t("Végleges árat műszaki validáció után adunk.", "A final price is provided after technical validation.")}</p></div><a class="button button-wide" href="${c.url("rendszer-ajanlat")}?product=${p.id}">${c.t("AJÁNLATOT KÉREK ERRE A RENDSZERRE", "GET A QUOTE FOR THIS SYSTEM")} ${arrow}</a></div></section>${sampleNotice(c)}<section class="section why-section"><div><p class="eyebrow">${c.t("RENDSZERBEN TERVEZVE", "DESIGNED AS A SYSTEM")}</p><h2>${c.t("Az épülethez méretezett rendszer.", "A system sized for the building.")}</h2><p>${c.t("Az alapterület csak kiindulópont. A hőveszteség, a hőleadók és a használati melegvíz-igény alapján méretezünk. Minden projektet műszaki szakember ellenőriz.", "Floor area is only a starting point. Heat loss, emitters and domestic hot water demand inform the design. Every project is checked by a technical specialist.")}</p></div><div><h3>${c.t("Tervezett rendszerelemek", "Planned system components")}</h3><ul class="plain-list">${(c.lang === "hu" ? p.parts : ["Outdoor unit", "Indoor hydraulic module", "Domestic hot water cylinder", "System controls", "Hydraulic components", "Installation and commissioning"]).map((v) => `<li>${e(v)}</li>`).join("")}</ul><p class="small">${c.t("Építési munka, villamoshálózat-bővítés és hőleadócsere csak egyedi egyeztetés alapján része az ajánlatnak.", "Building work, electrical upgrades and emitter replacement are included only when separately agreed.")}</p></div></section><section class="help-banner"><div><h2>${c.t("Új építés vagy korszerűsítés?", "New build or renovation?")}</h2><p>${c.t("Néhány alapadatból elindulhat a közös tervezés. Dokumentumot feltölteni nem kötelező.", "A few details are enough to start planning. Documents are always optional.")}</p></div><a class="button button-light" href="${c.url("rendszer-ajanlat")}?product=${p.id}">${c.t("Indítsuk el", "Let’s get started")} ${arrow}</a></section></div>`;
}
