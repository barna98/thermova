import { home } from "./pages/home.js";
import { locale, escape as e } from "./i18n.js";
import { header, footer } from "./components.js";
import {
  catalogue,
  hpCatalogue,
} from "./pages/shop.js";
import { selector, quotePage } from "./pages/forms.js";
import { information } from "./pages/information.js";
import { config, newQuote } from "./site-data.js";
export function parseRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const lang = parts[0] === "en" ? "en" : "hu";
  if (["hu", "en"].includes(parts[0])) parts.shift();
  return { lang, path: parts.join("/") };
}
export function renderPage(lang, path = "", state = {}) {
  const c = locale(lang);
  let html, title;
  const [base, id] = path.split("/");
  if (!path) {
    html = home(c);
    title = c.t(
      "Klíma és hőszivattyú, szakértelemmel",
      "Air conditioning and heat pumps, with expertise",
    );
  } else if (base === "klimak") {
    html = id ? null : catalogue(c);
    title = id ? "404" : c.t(
          "Klímák, átlátható telepítési árakkal",
          "Air conditioners with clear installation pricing",
        );
  } else if (base === "hoszivattyuk") {
    html = id ? null : hpCatalogue(c);
    title = id ? "404" : c.t("Hőszivattyúrendszerek", "Heat pump systems");
  } else if (base === "valaszto") {
    html = selector(c, state.selector);
    title = c.t(
      "Személyre szabott klímaválasztó",
      "Personalised AC finder",
    );
  } else if (["ajanlat", "rendszer-ajanlat"].includes(base)) {
    html = quotePage(
      c,
      state.quote ||
        newQuote(
          base === "rendszer-ajanlat" ? "hp" : "ac",
        ),
    );
    title = c.t("Ajánlatkérés", "Request a quote");
  } else {
    html = information(c, path);
    title = {
      telepites: c.t(
        "Standard telepítés – 109 000 Ft",
        "Standard installation – 109,000 HUF",
      ),
      rolunk: c.t("A Thermova", "About Thermova"),
      szolgaltatasok: c.t("Szolgáltatások", "Services"),
      tudastar: c.t("Választási útmutató", "Buying guide"),
      kapcsolat: c.t("Kapcsolat", "Contact"),
      adatkezeles: c.t("Adatkezelés", "Privacy"),
    }[path];
  }
  if (!html) {
    html = `<section class="container section empty-state"><p class="eyebrow">404</p><h1>${c.t("Ez az oldal nem található.", "This page could not be found.")}</h1><a class="button" href="${c.url("klimak")}">${c.t("Vissza a klímákhoz", "Back to air conditioners")}</a></section>`;
    title = "404";
  }
  const notFound = title === "404";
  return {
    body: `${header(c, notFound ? "" : path)}<main id="main" tabindex="-1">${html}</main>${footer(c)}`,
    title: `${title} | THERMOVA`,
    notFound,
    description: c.t(
      "THERMOVA – átgondolt klíma- és hőszivattyú-megoldások. Egyszerű választás, átlátható árak és standard klímatelepítés 109 000 Ft-ért.",
      "THERMOVA – considered air conditioning and heat pump solutions. Simple choices, transparent pricing and standard AC installation for 109,000 HUF.",
    ),
  };
}
export function documentHTML(lang, path, state = {}) {
  const page = renderPage(lang, path, state);
  const origin = config.siteOrigin || "https://thermova.hu";
  const route = path ? `${path}/` : "";
  const canonical = page.notFound
    ? `${origin}/404.html`
    : `${origin}/${lang}/${route}`;
  const indexable = [
    "",
    "klimak",
    "hoszivattyuk",
    "telepites",
    "szolgaltatasok",
    "rolunk",
    "tudastar",
    "kapcsolat",
  ].includes(path);
  const robots = !page.notFound && indexable ? "index,follow" : "noindex,follow";
  const alternates = page.notFound
    ? ""
    : `<link rel="alternate" hreflang="hu" href="${origin}/hu/${route}"><link rel="alternate" hreflang="en" href="${origin}/en/${route}"><link rel="alternate" hreflang="x-default" href="${origin}/hu/${route}">`;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#FFFFFF"><title>${e(page.title)}</title><meta name="description" content="${e(page.description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${e(page.title)}"><meta property="og:description" content="${e(page.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/assets/architecture.webp">${alternates}<link rel="icon" href="/assets/mark.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/src/styles.css?v=21"><link rel="stylesheet" href="/src/brand.css?v=21">${!path ? '<link rel="preload" as="image" href="/assets/architecture.webp">' : ""}<script type="module" src="/src/app.js?v=21"></script></head><body>${page.body}<noscript><p class="noscript">${lang === "hu" ? "Az ajánlatkérés elküldéséhez JavaScript szükséges." : "JavaScript is required to send the enquiry."}</p></noscript></body></html>`;
}
