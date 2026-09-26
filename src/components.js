import { escape as e } from "./i18n.js";
import { config, installationItems } from "./domain.js";
export const arrow =
  '<span class="ui-arrow" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5"/></svg></span>';
export const icon = (type) =>
  `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{ bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>', search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>', menu: '<path d="M5 7h14M5 12h14M5 17h14"/>', tune: '<path d="M4 7h10m4 0h2M4 17h2m4 0h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>', check: '<path d="m5 12 4 4L19 6"/>', close: '<path d="m7 7 10 10M17 7 7 17"/>', back: '<path d="m14.5 5-7 7 7 7"/>', forward: '<path d="m9.5 5 7 7-7 7"/>', download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>' }[type] || ""}</svg>`;
export function logo(c) {
  return `<a class="logo" href="${c.url()}" aria-label="THERMOVA ${c.t("főoldal", "home")}"><span class="original-wordmark"><img src="/assets/thermova-wordmark.png" width="700" height="100" alt="THERMOVA" decoding="async"></span><span class="tagline">${c.t("ÉPÜLETENERGETIKAI MEGOLDÁSOK", "BUILDING ENERGY SOLUTIONS")}</span></a>`;
}
export const productAsset = (p) =>
  p?.tier === "premium" ? "climate-graphite" : "climate";
export function header(c, path = "") {
  return `<a class="skip" href="#main">${c.t("Ugrás a tartalomhoz", "Skip to content")}</a><div class="topbar"><div class="container"><span>${c.t("Klíma és hőszivattyú otthonra és cégeknek.", "Air conditioning and heat pumps for homes and businesses.")}</span><a href="${c.url("telepites")}">${c.t("Standard klímatelepítés", "Standard AC installation")} <b>${c.money(config.installationPrice)}</b> ${arrow}</a></div></div><header class="header"><div class="container header-inner">${logo(c)}<nav class="desktop-nav" aria-label="${c.t("Fő navigáció", "Main navigation")}">${[
    ["klimak", "Klímák", "Air conditioners"],
    ["hoszivattyuk", "Hőszivattyúk", "Heat pumps"],
    ["szolgaltatasok", "Szolgáltatások", "Services"],
    ["rolunk", "A Thermova", "About us"],
  ]
    .map(
      ([p, hu, en]) =>
        `<a href="${c.url(p)}" ${path.startsWith(p) ? 'aria-current="page"' : ""}>${c.t(hu, en)}</a>`,
    )
    .join(
      "",
    )}</nav><div class="header-tools"><div class="language" aria-label="${c.t("Nyelvválasztás", "Language")}">${["hu", "en"].map((l) => `<a lang="${l}" hreflang="${l}" href="/${l}/${path ? path + "/" : ""}" ${c.lang === l ? 'aria-current="true"' : ""}>${l.toUpperCase()}</a>`).join("<span>/</span>")}</div><button class="icon-btn" data-action="search" aria-label="${c.t("Keresés", "Search")}">${icon("search")}</button><button class="icon-btn cart-button" data-action="cart" aria-label="${c.t("Kosár", "Bag")}">${icon("bag")}<span class="cart-count" hidden>0</span></button><a class="button button-small header-quote" href="${c.url("ajanlat")}">${c.t("Ajánlatot kérek", "Get a quote")}${arrow}</a><button class="icon-btn mobile-only" data-action="menu" aria-label="${c.t("Menü megnyitása", "Open menu")}">${icon("menu")}</button></div></div></header>`;
}
export function footer(c) {
  return `<footer><div class="container footer-top"><div>${logo(c)}<p>${c.t("Modern megoldások.<br>Élhetőbb épületek.", "Modern solutions.<br>More liveable buildings.")}</p></div><div><h3>${c.t("Megoldások", "Solutions")}</h3><a href="${c.url("klimak")}">${c.t("Klímák", "Air conditioners")}</a><a href="${c.url("hoszivattyuk")}">${c.t("Hőszivattyúrendszerek", "Heat pump systems")}</a><a href="${c.url("telepites")}">${c.t("Standard telepítés", "Standard installation")}</a></div><div><h3>Thermova</h3><a href="${c.url("rolunk")}">${c.t("Szemléletünk", "Our approach")}</a><a href="${c.url("tudastar")}">${c.t("Választási útmutató", "Buying guide")}</a><a href="${c.url("kapcsolat")}">${c.t("Kapcsolat", "Contact")}</a></div><div class="footer-cta"><h3>${c.t("Segítünk klímát választani.", "Need help choosing an air conditioner?")}</h3><a href="${c.url("valaszto")}">${c.t("Klímaválasztó indítása", "Start the AC finder")} ${arrow}</a></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} THERMOVA</span><span>${c.t("Az árak bruttó, forintban megadott árak.", "All prices include VAT and are in HUF.")}</span><a href="${c.url("adatkezeles")}">${c.t("Adatkezelés", "Privacy")}</a></div></footer><dialog id="overlay" class="overlay" aria-labelledby="dialog-title"></dialog><div class="toast" role="status" aria-live="polite" hidden></div>`;
}
export function breadcrumb(c, items) {
  return `<nav class="breadcrumb" aria-label="${c.t("Morzsanavigáció", "Breadcrumb")}"><a href="${c.url()}">${c.t("Főoldal", "Home")}</a>${items.map(([title, path]) => `<span aria-hidden="true">/</span>${path ? `<a href="${c.url(path)}">${e(title)}</a>` : `<span aria-current="page">${e(title)}</span>`}`).join("")}</nav>`;
}
export function image(
  name,
  alt,
  { small = false, hero = false, cls = "" } = {},
) {
  return `<img class="${cls}" src="/assets/${name}${small ? "-small" : ""}.webp" ${!small ? `srcset="/assets/${name}-small.webp 640w, /assets/${name}.webp 1440w" sizes="${hero ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 760px) 100vw, 50vw"}"` : ""} width="1536" height="1024" alt="${e(alt)}" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
export const sectionHead = (c, kicker, title, link) =>
  `<div class="section-head"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div>${link ? `<a class="text-link" href="${c.url(link[0])}">${link[1]} ${arrow}</a>` : ""}</div>`;
export function productText(c, p) {
  return c.t(
    p.mode === "cool"
      ? "Elsősorban nyári hűtéshez ajánljuk."
      : p.mode === "heat"
        ? "Ha a klímát elsősorban fűtésre használnád."
        : p.tier === "premium"
          ? "Prémium kategóriájú klíma hűtésre és ráfűtésre."
          : p.db <= 20
            ? "Ha fontos az alacsony beltéri zajszint."
            : "Nyári hűtéshez és átmeneti időszakban ráfűtéshez.",
    p.mode === "cool"
      ? "Recommended mainly for summer cooling."
      : p.mode === "heat"
        ? "For those who mainly need their air conditioner for heating."
        : p.tier === "premium"
          ? "A premium air conditioner for cooling and supplementary heating."
          : p.db <= 20
            ? "For rooms where low indoor noise matters."
            : "For summer cooling and supplementary heating between seasons.",
  );
}
export function productCard(c, p) {
  return `<article class="product-card"><a class="product-visual" href="${c.url("klimak/" + p.id)}" tabindex="-1" aria-hidden="true"><span class="product-badge">${p.mode === "heat" ? c.t("Elsősorban fűtésre", "Designed for heating") : p.tier === "premium" ? c.t("Prémium kategória", "Premium range") : c.t("Hűtéshez és ráfűtéshez", "Cooling and supplementary heating")}</span>${image(productAsset(p), "", { small: true })}<span class="visual-caption">${c.t("Márkázott látványkép", "Branded concept image")}</span></a><div class="product-info"><div class="product-meta"><span>${e(p.brand)}</span><span>${p.room.join("–")} m²</span></div><h3><a href="${c.url("klimak/" + p.id)}">${e(p.name)}</a><span>${String(p.kw).replace(".", c.lang === "hu" ? "," : ".")} kW</span></h3><p>${productText(c, p)}</p><div class="prices"><div><span>${c.t("Készülékár", "Unit price")}</span><b>${c.money(p.price)}</b></div><div class="installed-price"><span>${c.t("Telepítéssel", "With installation")}</span><strong>${c.money(p.price + config.installationPrice)}</strong></div></div><a class="product-link" href="${c.url("klimak/" + p.id)}">${c.t("Megnézem", "View product")} ${arrow}</a></div></article>`;
}
export function sampleNotice(c) {
  return `<p class="sample-note">${c.t("Bemutató kínálat: a modellek, műszaki adatok és készülékárak mintaadatok. A képek márkázott látványtervek.", "Preview catalogue: models, specifications and unit prices are sample data. Images are branded concepts.")}</p>`;
}
export function installBlock(c, full = false) {
  return `<section class="installation ${full ? "installation-full" : ""}" id="installation"><div><p class="eyebrow">${c.t("KLÍMATELEPÍTÉS", "AC INSTALLATION")}</p><h2>${c.t("Mit tartalmaz<br>az alapszerelés?", "What does standard<br>installation include?")}</h2><p>${c.t("Az alapszerelés díja készülékenként 109 000 Ft bruttó. Az alábbi munkákat és anyagokat tartalmazza.", "Standard installation costs 109,000 HUF per unit, including VAT. The following work and materials are included.")}</p><div class="installation-price"><strong>${c.money(config.installationPrice)}</strong><span>${c.t("bruttó / készülék", "incl. VAT / unit")}</span></div><p class="small">${c.t("A kábelcsatornázás külön tétel. Az egyedi helyszíni igényeket külön egyeztetjük.", "Cable trunking is charged separately. Site-specific work is agreed individually.")}</p>${!full ? `<a class="text-link" href="${c.url("telepites")}">${c.t("A telepítés részletei", "Installation details")} ${arrow}</a>` : ""}</div><div><h3>${c.t("A standard telepítés tartalma", "Included in standard installation")}</h3><ul class="check-list">${(full ? installationItems : installationItems.slice(0, 6)).map((pair) => `<li>${icon("check")}<span>${c.t(...pair)}</span></li>`).join("")}</ul>${!full ? `<p class="small">${c.t("Továbbá: vákuumozás, beüzemelés, dokumentáció és takarítás.", "Also includes evacuation, commissioning, documentation and clean-up.")}</p>` : ""}</div></section>`;
}
export function helpBanner(c) {
  return `<section class="help-banner"><div><p class="eyebrow">${c.t("SEGÍTSÉG A VÁLASZTÁSHOZ", "HELP WITH CHOOSING")}</p><h2>${c.t("Melyik klímát<br>válaszd?", "Which air conditioner<br>should you choose?")}</h2><p>${c.t("Három rövid kérdés a helyiség méretéről, a használatról és a keretösszegről. Ezek alapján megmutatjuk a szóba jöhető készülékeket.", "Answer three quick questions about room size, usage and budget to see matching units.")}</p></div><a class="button button-light" href="${c.url("valaszto")}">${c.t("Segítsetek választani", "Help me choose")} ${arrow}</a></section>`;
}
export function field(
  c,
  {
    name,
    label,
    type = "text",
    value = "",
    required = true,
    options,
    extra = "",
    help = "",
  },
) {
  return `<label class="field"><span>${label}${required ? ' <span aria-hidden="true">*</span>' : ""}</span>${options ? `<select name="${name}" ${required ? "required" : ""} ${extra}><option value="">${c.t("Válassz…", "Select…")}</option>${options.map(([v, l]) => `<option value="${e(v)}" ${value === v ? "selected" : ""}>${e(l)}</option>`).join("")}</select>` : `<input type="${type}" name="${name}" value="${e(value)}" ${required ? "required" : ""} ${extra}>`}${help ? `<small>${help}</small>` : ""}</label>`;
}

export function brandGallery(c) {
  return `<section class="brand-story"><div class="brand-story-heading"><div><p class="eyebrow">${c.t("ÍGY DOLGOZUNK", "HOW WE WORK")}</p><h2>${c.t("A választástól<br>a beüzemelésig.", "From choosing a unit<br>to commissioning it.")}</h2></div><p>${c.t("Egyeztetjük a telepítés feltételeit, felszereljük a készüléket, és ellenőrizzük a működését. A munka végén a takarításról is gondoskodunk.", "We agree the installation requirements, fit the unit and check its operation. Clean-up is included too.")}</p></div><div class="brand-story-grid"><figure class="brand-photo brand-photo-van">${image("van", c.t("THERMOVA arculati látványkép: márkázott szervizautó egy modern épület előtt", "THERMOVA brand concept: branded service van outside a modern building"))}<figcaption><span>01 / ${c.t("KISZÁLLÁS", "SITE VISIT")}</span><strong>${c.t("A készüléket is kiszállítjuk.", "We deliver the unit too.")}</strong></figcaption></figure><figure class="brand-photo brand-photo-team">${image("technician", c.t("THERMOVA arculati látványkép: szakember márkázott munkaruhában", "THERMOVA brand concept: technician in branded workwear"))}<figcaption><span>02 / ${c.t("BEÜZEMELÉS", "COMMISSIONING")}</span><strong>${c.t("Próbaüzem és dokumentált átadás.", "Test run and documented handover.")}</strong></figcaption></figure></div><p class="image-disclosure">${c.t("THERMOVA arculati látványképek.", "THERMOVA brand concept imagery.")}</p></section>`;
}
export function livingStory(c) {
  return `<section class="living-story"><div class="living-photo">${image("interior", c.t("Világos nappali THERMOVA klímával – enteriőr-látványkép", "Bright living room with THERMOVA air conditioning — interior concept"))}</div><div class="living-copy"><p class="eyebrow">${c.t("KLÍMA A MINDENNAPOKRA", "EVERYDAY AIR CONDITIONING")}</p><h2>${c.t("Klíma otthonra<br>és munkához.", "Air conditioning<br>at home and at work.")}</h2><p>${c.t("Más klíma lehet jó egy hálószobába, mint egy forgalmas üzletbe. A helyiség mérete, a zajszint és a használat alapján segítünk választani.", "A bedroom and a busy shop may need different air conditioners. We help you choose based on room size, noise level and use.")}</p><a class="text-link" href="${c.url("klimak")}">${c.t("Találd meg a klímád", "Find your air conditioner")} ${arrow}</a><span class="image-disclosure">${c.t("Enteriőr-látványkép", "Interior concept image")}</span></div></section>`;
}
