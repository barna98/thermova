import { locale } from "./i18n.js";
import { parseRoute, renderPage } from "./render.js";
import { newQuote, leadPayload, config, climateBrands } from "./site-data.js";
import { icon, arrow } from "./components.js";

const state = { selector: null, quote: null };
let route = parseRoute(location.pathname);
let c = locale(route.lang);
let lastFocus = null;
let motionObserver;

function loadRoute() {
  route = parseRoute(location.pathname);
  c = locale(route.lang);
  const params = new URLSearchParams(location.search);
  if (route.path === "valaszto") {
    const brand = params.get("brand");
    if (brand && climateBrands.some((item) => item.name === brand)) {
      state.selector = { brand };
    }
  }
  if (["ajanlat", "rendszer-ajanlat"].includes(route.path)) {
    const kind = route.path === "rendszer-ajanlat" ? "hp" : "ac";
    const brand = params.get("brand");
    const need = params.get("need");
    const selectorKeys = ["size", "room", "mode", "noise", "budget", "brand"];
    const contextKey = [brand || "", need || "", params.get("source") || "", ...selectorKeys.map((key) => params.get(key) || "")].join(":");
    const validSeed = null;
    if (!state.quote || state.quote.kind !== kind || state.quote.seed !== validSeed || state.quote.contextKey !== contextKey) {
      state.quote = newQuote(kind, validSeed);
      state.quote.seed = validSeed;
      state.quote.contextKey = contextKey;
      const needs = {
        cooling: c.t("Mindennapi hűtéshez kérek ajánlatot.", "I would like a quote for everyday cooling."),
        quiet: c.t("Csendes, hálószobába való klímához kérek ajánlatot.", "I would like a quote for a quiet bedroom air conditioner."),
        heating: c.t("Fűtésre is alkalmas klímához kérek ajánlatot.", "I would like a quote for an air conditioner suitable for heating."),
        premium: c.t("Prémium komfortot adó klímához kérek ajánlatot.", "I would like a quote for a premium-comfort air conditioner."),
      };
      if (need && needs[need]) state.quote.note = needs[need];
      if (brand) state.quote.note = kind === "hp"
        ? c.t(`${brand} hőszivattyús rendszer érdekel.`, `I am interested in a ${brand} heat-pump system.`)
        : c.t(`${brand} klíma érdekel.`, `I am interested in ${brand} air conditioning.`);
      if (params.get("source") === "selector" && kind === "ac") {
        const labels = {
          size: { "15": "10–18 m²", "22": "18–25 m²", "30": "25–35 m²", "42": "35–50 m²" },
          room: { bedroom: c.t("hálószoba", "bedroom"), living: c.t("nappali", "living room"), office: c.t("iroda vagy üzlet", "office or shop"), other: c.t("más helyiség", "other room") },
          mode: { cool: c.t("hűtés", "cooling"), both: c.t("hűtés és fűtés", "cooling and heating"), heat: c.t("elsősorban fűtés", "mainly heating") },
          noise: { silent: c.t("nagyon halk működés", "very quiet operation"), quiet: c.t("halk működés", "quiet operation"), any: c.t("nem elsődleges", "not a priority") },
          budget: { value: c.t("kedvezőbb alapmegoldás", "more affordable solution"), balanced: c.t("kiegyensúlyozott ár és tudás", "balanced price and features"), premium: c.t("prémium komfort", "premium comfort"), open: c.t("nyitott a javaslatra", "open to recommendations") },
        };
        const rows = [
          [c.t("Helyiségméret", "Room size"), labels.size[params.get("size")]],
          [c.t("Helyiség", "Room"), labels.room[params.get("room")]],
          [c.t("Használat", "Use"), labels.mode[params.get("mode")]],
          [c.t("Zajszint", "Noise preference"), labels.noise[params.get("noise")]],
          [c.t("Megoldás szintje", "Solution level"), labels.budget[params.get("budget")]],
          [c.t("Márkapreferencia", "Brand preference"), brand || c.t("nincs", "none")],
        ].filter(([, value]) => value);
        state.quote.note = `${c.t("Klímaigény-felmérés", "Air-conditioning needs assessment")}\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}`;
      }
    }
    if (params.get("service") === "consultation" && !state.quote.note) {
      state.quote.note = c.t("Karbantartás vagy egyedi kérdés – részletek: ", "Maintenance or individual enquiry – details: ");
    }
  }
}

function render({ focus = null, scroll = false } = {}) {
  const page = renderPage(c.lang, route.path, state);
  const canonical = `${config.siteOrigin}/${c.lang}/${route.path ? route.path + "/" : ""}`;
  const indexable = ["", "klimak", "hoszivattyuk", "telepites", "szolgaltatasok", "rolunk", "tudastar", "kapcsolat"].includes(route.path);
  document.body.innerHTML = page.body;
  document.title = page.title;
  document.documentElement.lang = c.lang;
  document.querySelector('meta[name="description"]').content = page.description;
  document.querySelector('meta[name="robots"]').content = !page.notFound && indexable ? "index,follow" : "noindex,follow";
  document.querySelector('link[rel="canonical"]').href = page.notFound ? `${config.siteOrigin}/404.html` : canonical;
  document.querySelector('meta[property="og:title"]').content = page.title;
  document.querySelector('meta[property="og:url"]').content = page.notFound ? `${config.siteOrigin}/404.html` : canonical;
  document.querySelectorAll("link[hreflang]").forEach((link) => {
    link.href = `/${link.hreflang}/${route.path ? route.path + "/" : ""}`;
  });
  initMotion();
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
  if (focus) document.querySelector(focus)?.focus({ preventScroll: !scroll });
}

function navigate(url) {
  history.pushState({}, "", url);
  loadRoute();
  render({ focus: "#main", scroll: true });
}

function initMotion() {
  motionObserver?.disconnect();
  const targets = document.querySelectorAll(".section-head, .category-path, .living-story, .help-banner, .split-editorial, .installation, .brand-story-heading, .brand-photo, .closing-statement, .service-hero > *, .choice-category-grid > *, .brand-logo-card, .selector-form fieldset, .recommendation-card, .home-guidance-grid > *, .principles > *");
  targets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  motionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      motionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
  targets.forEach((element) => motionObserver.observe(element));
}

function showDialog(title, body) {
  const dialog = document.querySelector("#overlay");
  if (!dialog.open) lastFocus = document.activeElement;
  dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${title}</h2><button class="dialog-close" data-action="close-dialog" aria-label="${c.t("Bezárás", "Close")}">${icon("close")}</button></div>${body}`;
  if (!dialog.open) dialog.showModal();
  document.documentElement.style.overflow = "hidden";
  requestAnimationFrame(() => dialog.querySelector(".dialog-close")?.focus());
  dialog.onclose = () => {
    document.documentElement.style.overflow = "";
    if (lastFocus?.isConnected) lastFocus.focus();
  };
}

function closeDialog() {
  document.querySelector("#overlay")?.close();
  document.documentElement.style.overflow = "";
}

function captureQuote(form) {
  if (!form || !state.quote) return;
  form.querySelectorAll("[name]").forEach((element) => {
    if (["form-name", "locale", "bot-field", "human-technical-review-required"].includes(element.name)) return;
    if (element.type === "radio" && !element.checked) return;
    const value = element.type === "checkbox" ? element.checked : element.value;
    const parts = element.name.split(".");
    if (parts[0] === "contact") state.quote.contact[parts[1]] = value;
    else state.quote[element.name] = value;
  });
}

function isLiveFormHost() {
  return ["thermova.hu", "www.thermova.hu"].includes(location.hostname) || location.hostname.endsWith(".netlify.app");
}

function formError(message) {
  const element = document.querySelector("#form-error");
  if (!element) return;
  element.hidden = false;
  element.textContent = message;
  element.scrollIntoView({ block: "center" });
}

function downloadQuote() {
  const data = {
    schemaVersion: 2,
    status: state.quote.sent ? "sent" : "prepared-not-sent",
    locale: c.lang,
    createdAt: new Date().toISOString(),
    request: leadPayload(state.quote, c.lang),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "thermova-ajanlatkeres.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

document.addEventListener("click", (event) => {
  const actionElement = event.target.closest("[data-action]");
  if (actionElement) {
    switch (actionElement.dataset.action) {
      case "menu":
        showDialog(`<span class="menu-kicker">THERMOVA</span><br>${c.t("Menü", "Menu")}`, `<div class="menu-intro">${c.t("Klíma és hőszivattyú otthonra és cégeknek.", "Air conditioning and heat pumps for homes and businesses.")}</div><nav class="menu-links">${[
          ["klimak", "Klímák", "Air conditioning"], ["hoszivattyuk", "Hőszivattyúk", "Heat pumps"], ["valaszto", "Segítünk választani", "Help me choose"], ["szolgaltatasok", "Szolgáltatások", "Services"], ["rolunk", "A Thermova", "About us"], ["tudastar", "Választási útmutató", "Buying guide"], ["kapcsolat", "Kapcsolat", "Contact"], ["ajanlat", "Ajánlatot kérek", "Get a quote"],
        ].map(([path, hu, en]) => `<a href="${c.url(path)}"><strong>${c.t(hu, en)}</strong>${arrow}</a>`).join("")}</nav><div class="menu-meta"><a href="${c.url("telepites")}">${c.t("Standard telepítés", "Standard installation")} · ${c.money(config.installationPrice)}</a><span>HU / EN</span></div>`);
        return;
      case "close-dialog": closeDialog(); return;
      case "download-quote": downloadQuote(); return;
      case "edit-quote": state.quote.complete = false; render({ focus: "#step-title" }); return;
    }
  }
  const dialog = event.target.closest("dialog");
  if (dialog && event.target === dialog) { closeDialog(); return; }
  const anchor = event.target.closest("a[href]");
  if (!anchor || anchor.target || anchor.hasAttribute("download") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin || url.pathname.startsWith("/assets/")) return;
  event.preventDefault();
  closeDialog();
  navigate(url.pathname + url.search + url.hash);
});

document.addEventListener("change", (event) => {
  const element = event.target;
  if (element.form?.id !== "quote-form") return;
  captureQuote(element.form);
  if (element.name === "interest") {
    state.quote.kind = element.value === "hp" ? "hp" : "ac";
    render();
    document.querySelector('[name="interest"]:checked')?.focus();
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (form.id === "selector-form") {
    event.preventDefault();
    if (!form.reportValidity()) return;
    state.selector = Object.fromEntries(new FormData(form));
    const params = new URLSearchParams({ source: "selector", ...state.selector });
    if (!state.selector.brand) params.delete("brand");
    navigate(`${c.url("ajanlat")}?${params.toString()}`);
    return;
  }
  if (form.id !== "quote-form") return;
  event.preventDefault();
  captureQuote(form);
  if (!form.reportValidity()) return;
  const quote = state.quote;
  if (!quote.contact.name.trim() || !quote.contact.city.trim() || !quote.contact.phone.trim() || !quote.contact.email.trim()) {
    formError(c.t("Add meg a neved, az email címed, a telefonszámod és a települést.", "Enter your name, email address, phone number and town or city."));
    return;
  }
  const submit = form.querySelector('[type="submit"]');
  if (config.quoteEndpoint) {
    if (!isLiveFormHost()) {
      formError(c.t("A helyi előnézet nem küld valódi ajánlatkérést. A közzétett Thermova oldalon az űrlap élesben működik.", "The local preview does not send a real enquiry. The form works on the published Thermova site."));
      return;
    }
    submit.disabled = true;
    submit.textContent = c.t("Küldés…", "Sending…");
    try {
      const body = new URLSearchParams(new FormData(form));
      body.set("form-name", config.quoteFormName);
      body.set("human-technical-review-required", String(leadPayload(quote, c.lang).humanTechnicalReviewRequired));
      const response = await fetch(config.quoteEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error("Request failed");
      quote.sent = true;
    } catch {
      submit.disabled = false;
      submit.textContent = c.t("Visszahívást kérek", "Request a callback");
      formError(c.t("Nem sikerült elküldeni az érdeklődést. Az adataid megmaradtak, kérjük, próbáld újra.", "We couldn’t send your enquiry. Your details are preserved; please try again."));
      return;
    }
  }
  quote.complete = true;
  render({ focus: "#step-title" });
  document.querySelector(".lead-form-panel")?.scrollIntoView({ block: "start" });
});

window.addEventListener("popstate", () => { loadRoute(); render({ focus: "#main", scroll: true }); });
loadRoute();
render();
