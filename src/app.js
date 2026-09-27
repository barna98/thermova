import { locale, escape as e } from "./i18n.js";
import { parseRoute, renderPage } from "./render.js";
import { products } from "./catalogue.js";
import {
  product,
  system,
  newQuote,
  leadPayload,
  newUnit,
  safeCart,
  totals,
  reviewRequired,
  config,
  cartTotals,
  cartKey,
} from "./domain.js";
import { results } from "./pages/shop.js";
import { selectorResults } from "./pages/forms.js";
import { icon, image, arrow, productAsset } from "./components.js";
const state = {
  purchaseOptions: {},
  filters: {},
  selector: null,
  quote: null,
  cart: [],
};
try {
  state.cart = safeCart(
    JSON.parse(localStorage.getItem("thermova.bag.v1") || "[]"),
  );
} catch {}
let route = parseRoute(location.pathname),
  c = locale(route.lang),
  lastFocus = null,
  toastTimer;
function loadRoute() {
  route = parseRoute(location.pathname);
  c = locale(route.lang);
  const params = new URLSearchParams(location.search);
  // A bookmarked device-only URL must never silently drop installation lines.
  if (route.path === "keszulekigeny" && state.cart.some((item) => item.installation)) {
    history.replaceState({}, "", c.url("ajanlat") + "?cart=1");
    return loadRoute();
  }
  if (route.path === "klimak") state.filters = Object.fromEntries(params);
  if (["ajanlat", "rendszer-ajanlat", "keszulekigeny"].includes(route.path)) {
    const kind =
      route.path === "rendszer-ajanlat"
        ? "hp"
        : route.path === "keszulekigeny"
          ? "device"
          : "ac";
    const seed = params.get("product");
    const validSeed =
      kind === "hp"
        ? system(seed)
          ? seed
          : null
        : product(seed)
          ? seed
          : null;
    if (
      !state.quote ||
      state.quote.kind !== kind ||
      (validSeed && state.quote.seed !== validSeed)
    ) {
      state.quote = newQuote(kind, validSeed);
      state.quote.seed = validSeed;
    }
    if (params.get("cart") === "1") {
      const signature = JSON.stringify(state.cart);
      if (state.quote.cartSignature !== signature) {
        state.quote = newQuote("ac");
        state.quote.units = state.cart
          .filter((item) => item.installation)
          .flatMap((item) =>
            Array.from({ length: item.qty }, () => newUnit(item.id)),
          );
        state.quote.deviceOnly = state.cart.filter(
          (item) => !item.installation,
        );
        state.quote.cartSignature = signature;
        if (!state.quote.units.length) {
          state.quote.kind = "device";
          state.quote.units = state.quote.deviceOnly.flatMap((item) =>
            Array.from({ length: item.qty }, () => newUnit(item.id)),
          );
          state.quote.deviceOnly = [];
          state.quote.step = 4;
        }
      }
    }
    if (kind === "device") {
      state.quote.units = state.cart.flatMap((item) =>
        Array.from({ length: item.qty }, () => newUnit(item.id)),
      );
      state.quote.step = 4;
    }
    if (params.get("service") === "consultation" && !state.quote.note)
      state.quote.note = c.t(
        "Karbantartás vagy egyedi kérdés – részletek: ",
        "Maintenance or individual enquiry – details: ",
      );
  }
}
function render({ focus = null, scroll = false } = {}) {
  const page = renderPage(c.lang, route.path, state);
  const canonical = `${config.siteOrigin}/${c.lang}/${route.path ? route.path + "/" : ""}`;
  const indexable = [
    "",
    "telepites",
    "szolgaltatasok",
    "rolunk",
    "tudastar",
    "kapcsolat",
  ].includes(route.path);
  document.body.innerHTML = page.body;
  document.title = page.title;
  document.documentElement.lang = c.lang;
  document.querySelector('meta[name="description"]').content = page.description;
  document.querySelector('meta[name="robots"]').content =
    !page.notFound && indexable ? "index,follow" : "noindex,follow";
  document.querySelector('link[rel="canonical"]').href = page.notFound
    ? `${config.siteOrigin}/404.html`
    : canonical;
  document.querySelector('meta[property="og:title"]').content = page.title;
  document.querySelector('meta[property="og:url"]').content = page.notFound
    ? `${config.siteOrigin}/404.html`
    : canonical;
  document
    .querySelectorAll("link[hreflang]")
    .forEach(
      (a) => (a.href = `/${a.hreflang}/${route.path ? route.path + "/" : ""}`),
    );
  updateCartBadge();
  initMotion();
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
  if (focus) document.querySelector(focus)?.focus({ preventScroll: !scroll });
}
function navigate(url, { replace = false } = {}) {
  if (replace) history.replaceState({}, "", url);
  else history.pushState({}, "", url);
  loadRoute();
  render({ focus: "#main", scroll: true });
}
function updateCartBadge() {
  const count = state.cart.reduce((n, x) => n + x.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
    el.hidden = !count;
  });
  document.querySelectorAll('[data-action="cart"]').forEach((el) => {
    el.setAttribute(
      "aria-label",
      count
        ? c.t(`Kosár, ${count} termék`, `Bag, ${count} items`)
        : c.t("Kosár, üres", "Bag, empty"),
    );
  });
}
let motionObserver;
function initMotion() {
  motionObserver?.disconnect();
  const targets = document.querySelectorAll(
    ".section-head, .category-path, .product-card, .living-story, .help-banner, .split-editorial, .installation, .brand-story-heading, .brand-photo, .closing-statement, .catalogue-intro > div, .catalogue-intro-media, .product-detail, .hp-card, .principles > *",
  );
  targets.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        motionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
  );
  targets.forEach((el) => motionObserver.observe(el));
}
function saveCart() {
  try {
    localStorage.setItem("thermova.bag.v1", JSON.stringify(state.cart));
  } catch {}
  updateCartBadge();
}
function showToast(text) {
  clearTimeout(toastTimer);
  const el = document.querySelector(".toast");
  el.textContent = text;
  el.hidden = false;
  toastTimer = setTimeout(() => (el.hidden = true), 4000);
}
function showDialog(title, body) {
  const d = document.querySelector("#overlay");
  if (!d.open) lastFocus = document.activeElement;
  d.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${title}</h2><button class="dialog-close" data-action="close-dialog" aria-label="${c.t("Bezárás", "Close")}">${icon("close")}</button></div>${body}`;
  if (!d.open) {
    d.showModal();
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => d.querySelector(".dialog-close")?.focus());
  }
  d.onclose = () => {
    document.documentElement.style.overflow = "";
    if (lastFocus?.isConnected) lastFocus.focus();
  };
}
function closeDialog() {
  document.querySelector("#overlay")?.close();
  document.documentElement.style.overflow = "";
}
function cartDialog() {
  const amount = cartTotals(state.cart);
  showDialog(
    c.t("A kosarad", "Your bag"),
    state.cart.length
      ? `${state.cart
          .map((item) => {
            const p = product(item.id),
              key = cartKey(item);
            return `<div class="cart-item">${image(productAsset(p), c.t("Termékfotó", "Product image"), { small: true })}<div><h3>${p.brand} ${p.name}</h3><p class="cart-variant">${item.installation ? c.t("Alapszereléssel", "With standard installation") : c.t("Csak készülék · szerelés nélkül", "Unit only · without installation")}</p><p>${c.money(p.price + (item.installation ? config.installationPrice : 0))} <small>/ ${c.t("db", "unit")}</small></p><div class="quantity-control"><button data-action="cart-minus" data-key="${key}" aria-label="${e(c.t("Kevesebb: ", "Decrease: ") + p.name)}">−</button><span aria-label="${c.t("Darabszám", "Quantity")}">${item.qty}</span><button data-action="cart-plus" data-key="${key}" ${item.qty >= 20 ? "disabled" : ""} aria-label="${e(c.t("Több: ", "Increase: ") + p.name)}">+</button><button class="remove" data-action="cart-remove" data-key="${key}">${c.t("Törlés", "Remove")}</button></div></div></div>`;
          })
          .join(
            "",
          )}<dl class="cart-breakdown"><div><dt>${c.t("Készülékek", "Equipment")}</dt><dd>${c.money(amount.device)}</dd></div><div><dt>${c.t("Alapszerelés", "Standard installation")} × ${amount.installedCount}</dt><dd>${c.money(amount.installation)}</dd></div></dl><div class="cart-total"><span>${c.t("Összesen, bruttó", "Total, incl. VAT")}</span><strong>${c.money(amount.total)}</strong></div><p class="small">${amount.installedCount ? c.t("A standard telepítés tartalmát a helyszíni feltételekkel egyeztetjük. A kábelcsatornázás külön tétel.", "Standard installation is subject to site conditions. Cable trunking is extra.") : c.t("Telepítés nélkül. A szállítás feltételeit egyeztetéskor pontosítjuk.", "Without installation. Delivery terms are confirmed during consultation.")}</p><a class="button button-wide" href="${c.url(amount.installedCount ? "ajanlat" : "keszulekigeny")}${amount.installedCount ? "?cart=1" : ""}">${amount.installedCount ? c.t("Visszahívást kérek", "Request a callback") : c.t("Készülékigény egyeztetése", "Discuss my unit request")} ${arrow}</a>${state.cart.reduce((n, x) => n + x.qty, 0) >= 2 ? `<p class="cart-review-note">${c.t("Két vagy több klíma: a végleges ajánlat előtt emberi ellenőrzés szükséges.", "Two or more units: human review is required before the final quote.")}</p>` : ""}<p class="notice">${c.t("Ez az egyeztetési kosár nem indít online fizetést. A készülékárat, elérhetőséget és szállítást visszaigazoljuk.", "This consultation bag does not start online payment. Unit price, availability and delivery are confirmed with you.")}</p>`
      : `<div class="empty-state"><h3>${c.t("Még üres a kosarad.", "Your bag is empty.")}</h3><p>${c.t("Nézz körül, és találd meg az otthonodhoz illő klímát.", "Explore air conditioners for your home.")}</p><a href="${c.url("klimak")}" class="button">${c.t("Klímák böngészése", "Explore air conditioners")} ${arrow}</a></div>`,
  );
}
function searchMarkup(q = "") {
  const list = products
    .filter((p) =>
      `${p.brand} ${p.name}`.toLowerCase().includes(q.toLowerCase()),
    )
    .slice(0, 8);
  return `<p class="small" role="status">${list.length} ${c.t("találat", "matches")}</p>${list.length ? list.map((p) => `<a class="search-result" href="${c.url("klimak/" + p.id)}"><div><strong>${p.brand} ${p.name}</strong><small>${p.room.join("–")} m² · ${c.money(p.price)}</small></div>${arrow}</a>`).join("") : `<p>${c.t("Nincs találat. Próbálj másik modellnevet.", "No matches. Try another model name.")}</p>`}`;
}
function updateFilters() {
  const form = document.querySelector("#filters");
  state.filters = Object.fromEntries(new FormData(form));
  document.querySelector("#results").innerHTML = results(c, state.filters);
  const activeCount = ["size", "mode", "price", "brand"].filter(
    (key) => state.filters[key],
  ).length;
  const badge = form.querySelector(".filter-active-count");
  if (badge) {
    badge.textContent = activeCount;
    badge.hidden = !activeCount;
  }
  const params = new URLSearchParams(
    Object.entries(state.filters).filter(([, v]) => v),
  );
  history.replaceState(
    {},
    "",
    c.url("klimak") + (params.size ? "?" + params : ""),
  );
}
function captureQuote(form) {
  if (!form || !state.quote) return;
  form.querySelectorAll("[name]").forEach((el) => {
    const name = el.name;
    if (
      name === "files" ||
      name === "functions" ||
      (el.type === "radio" && !el.checked)
    )
      return;
    const value = el.type === "checkbox" ? el.checked : el.value;
    const parts = name.split(".");
    if (parts[0] === "units") {
      state.quote.units[+parts[1]][parts[2]] = value;
    } else if (parts[0] === "contact") {
      state.quote.contact[parts[1]] = value;
    } else state.quote[name] = value;
  });
  if (form.querySelector('[name="functions"]'))
    state.quote.functions = [
      ...form.querySelectorAll('[name="functions"]:checked'),
    ].map((el) => el.value);
}
function formError(message) {
  const el = document.querySelector("#form-error");
  el.hidden = false;
  el.textContent = message;
  el.scrollIntoView({ block: "center" });
}
function downloadQuote() {
  const q = state.quote;
  const data = {
    schemaVersion: 2,
    status: q.sent ? "sent" : "prepared-not-sent",
    locale: c.lang,
    createdAt: new Date().toISOString(),
    request: leadPayload(q, c.lang),
    sampleCatalogue: config.catalogueIsSample,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "thermova-ajanlatkeres.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button) {
    const action = button.dataset.action,
      id = button.dataset.id;
    const q = state.quote;
    switch (action) {
      case "menu":
        showDialog(
          `<span class="menu-kicker">THERMOVA</span><br>${c.t("Menü", "Menu")}`,
          `<div class="menu-intro">${c.t("Klíma és hőszivattyú otthonra és cégeknek.", "Air conditioning and heat pumps for homes and businesses.")}</div><nav class="menu-links">${[
            ["klimak", "Klímák", "Air conditioners"],
            ["hoszivattyuk", "Hőszivattyúk", "Heat pumps"],
            ["szolgaltatasok", "Szolgáltatások", "Services"],
            ["rolunk", "A Thermova", "About us"],
            ["tudastar", "Választási útmutató", "Buying guide"],
            ["kapcsolat", "Kapcsolat", "Contact"],
            ["ajanlat", "Ajánlatot kérek", "Get a quote"],
          ]
            .map(([u, hu, en], i) => `<a href="${c.url(u)}"><span>0${i + 1}</span><strong>${c.t(hu, en)}</strong>${arrow}</a>`)
            .join("")}</nav><div class="menu-meta"><a href="${c.url("telepites")}">${c.t("Standard telepítés", "Standard installation")} · ${c.money(config.installationPrice)}</a><span>HU / EN</span></div>`,
        );
        break;
      case "close-dialog":
        closeDialog();
        break;
      case "cart":
        cartDialog();
        break;
      case "search":
        showDialog(
          c.t("Találd meg a készüléked.", "Find your unit."),
          `<label for="search-input" class="small">${c.t("Keresés modellnév vagy márka alapján", "Search by model or brand")}</label><input id="search-input" class="search-field" type="search" autocomplete="off" placeholder="${c.t("Pl. Comfort 35", "e.g. Comfort 35")}"><div id="search-results">${searchMarkup()}</div>`,
        );
        document.querySelector("#search-input").focus();
        break;
      case "add-cart": {
        if (!product(id)) break;
        const installation = state.purchaseOptions[id] ?? true;
        const existing = state.cart.find(
          (x) => x.id === id && x.installation === installation,
        );
        if (existing) {
          if (existing.qty < 20) existing.qty++;
        } else state.cart.push({ id, qty: 1, installation });
        saveCart();
        cartDialog();
        break;
      }
      case "cart-minus":
      case "cart-plus":
      case "cart-remove": {
        const item = state.cart.find((x) => cartKey(x) === button.dataset.key);
        if (!item) break;
        if (action === "cart-remove") item.qty = 0;
        else item.qty += action === "cart-plus" ? 1 : -1;
        state.cart = state.cart.filter((x) => x.qty > 0);
        saveCart();
        cartDialog();
        document
          .querySelector(
            `[data-action="${action}"][data-key="${button.dataset.key}"]`,
          )
          ?.focus();
        break;
      }
      case "filter-toggle": {
        const form = button.closest("#filters");
        const open = form.dataset.open !== "true";
        form.dataset.open = String(open);
        button.setAttribute("aria-expanded", String(open));
        if (open)
          requestAnimationFrame(() =>
            form.querySelector("#filter-controls select")?.focus(),
          );
        break;
      }
      case "remove-filter": {
        const form = document.querySelector("#filters");
        const control = form?.elements.namedItem(button.dataset.filter);
        if (control) control.value = "";
        updateFilters();
        document.querySelector(".mobile-filter-toggle")?.focus();
        break;
      }
      case "clear-filters":
        state.filters = {};
        history.replaceState({}, "", c.url("klimak"));
        render({ focus: "#filters select" });
        break;
      case "add-unit":
        captureQuote(document.querySelector("#quote-form"));
        q.units.push(newUnit());
        render();
        document
          .querySelector(`[name="units.${q.units.length - 1}.pid"]`)
          ?.focus();
        break;
      case "remove-unit":
        captureQuote(document.querySelector("#quote-form"));
        q.units.splice(+button.dataset.index, 1);
        render({ focus: "#step-title" });
        break;
      case "quote-back":
        captureQuote(document.querySelector("#quote-form"));
        q.step--;
        render({ focus: "#step-title" });
        break;
      case "remove-file":
        captureQuote(document.querySelector("#quote-form"));
        q.files.splice(+button.dataset.index, 1);
        render({ focus: '[name="files"]' });
        break;
      case "download-quote":
        downloadQuote();
        break;
      case "edit-quote":
        q.complete = false;
        q.step = q.kind === "device" ? 4 : 1;
        render({ focus: "#step-title" });
        break;
    }
    return;
  }
  const link = event.target.closest("a[href]");
  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.target === "_blank" ||
    link.hasAttribute("download")
  )
    return;
  const url = new URL(link.href);
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.hash) {
    event.preventDefault();
    const target = document.getElementById(
      decodeURIComponent(url.hash.slice(1)),
    );
    if (target) {
      if (target.tagName === "DETAILS") target.open = true;
      target.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
    return;
  }
  event.preventDefault();
  closeDialog();
  if (link.closest(".language")) url.search = location.search;
  navigate(url.pathname + url.search + url.hash);
});
document.addEventListener("input", (event) => {
  const el = event.target;
  if (el.id === "search-input") {
    document.querySelector("#search-results").innerHTML = searchMarkup(
      el.value,
    );
    return;
  }
  if (el.closest("#quote-form")) captureQuote(el.form);
});
document.addEventListener("change", (event) => {
  const el = event.target;
  if (el.name === "purchase-installation") {
    const selected = el.value === "yes";
    state.purchaseOptions[el.dataset.product] = selected;
    const price = c.money(
      product(el.dataset.product).price +
        (selected ? config.installationPrice : 0),
    );
    document.querySelector("#selected-price").textContent = price;
    document.querySelector("#sticky-price").textContent = price;
    document.querySelector("#sticky-variant").textContent = selected
      ? c.t("Alapszereléssel", "With installation")
      : c.t("Csak készülék", "Unit only");
    return;
  }
  if (el.form?.id === "filters") {
    updateFilters();
    return;
  }
  if (el.form?.id === "quote-form") {
    captureQuote(el.form);
    if (el.name === "interest" || el.name.endsWith(".property") || el.name.endsWith(".pid")) {
      render();
      document.querySelector(`[name="${el.name}"]`)?.focus();
    }
    if (el.type === "file") {
      const hp = state.quote.kind === "hp",
        allowed = hp
          ? ["application/pdf", "image/jpeg", "image/png", "image/webp"]
          : ["image/jpeg", "image/png", "image/webp"];
      const picked = [...el.files];
      if (
        picked.some(
          (f) => !allowed.includes(f.type) || f.size > 10 * 1024 * 1024,
        )
      ) {
        formError(
          c.t(
            "JPG, PNG, WebP" +
              (hp ? " vagy PDF" : "") +
              " fájlt válassz, egyenként legfeljebb 10 MB méretben.",
            "Choose JPG, PNG, WebP" +
              (hp ? " or PDF" : "") +
              " files, up to 10 MB each.",
          ),
        );
        el.value = "";
        return;
      }
      const files = [...state.quote.files, ...picked].filter(
        (f, i, arr) =>
          arr.findIndex(
            (x) =>
              x.name === f.name &&
              x.size === f.size &&
              x.lastModified === f.lastModified,
          ) === i,
      );
      if (files.length > 6) {
        formError(
          c.t(
            "Legfeljebb 6 fájlt választhatsz.",
            "You can select up to 6 files.",
          ),
        );
        el.value = "";
        return;
      }
      state.quote.files = files;
      render({ focus: '[name="files"]' });
    }
  }
});
document.addEventListener("reset", (event) => {
  if (event.target.id === "filters") {
    event.preventDefault();
    state.filters = {};
    history.replaceState({}, "", c.url("klimak"));
    render({ focus: "#filters select" });
  }
});
document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (form.id === "filters") {
    event.preventDefault();
    updateFilters();
  }
  if (form.id === "selector-form") {
    event.preventDefault();
    state.selector = Object.fromEntries(new FormData(form));
    const result = document.querySelector("#selector-results");
    result.innerHTML = selectorResults(c, state.selector);
    result.scrollIntoView({ block: "start" });
    result.focus({ preventScroll: true });
  }
  if (form.id === "quote-form") {
    event.preventDefault();
    captureQuote(form);
    const q = state.quote;
    if (!form.reportValidity()) return;
    if (!q.contact.name.trim() || !q.contact.city.trim() || !q.contact.phone.trim() || !q.contact.email.trim()) {
      formError(c.t("Add meg a neved, az email címed, a telefonszámod és a települést.", "Enter your name, email address, phone number and town or city."));
      return;
    }
    if (!q.units.length && q.kind === "device") {
      formError(c.t("Előbb válassz egy készüléket a kosárba.", "Add a unit to your bag first."));
      return;
    }
    const submit = form.querySelector('[type="submit"]');
    if (submit.disabled) return;
    if (config.quoteEndpoint) {
      submit.disabled = true;
      submit.textContent = c.t("Küldés…", "Sending…");
      try {
        const response = await fetch(config.quoteEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload(q, c.lang)),
        });
        if (!response.ok) throw new Error("Request failed");
        const result = await response.json();
        if (result.success !== true) throw new Error("Receipt not confirmed");
        q.sent = true;
      } catch {
        submit.disabled = false;
        submit.textContent = c.t("Visszahívást kérek", "Request a callback");
        formError(c.t("Nem sikerült elküldeni az érdeklődést. Az adataid megmaradtak, kérjük, próbáld újra.", "We couldn’t send your enquiry. Your details are preserved; please try again."));
        return;
      }
    }
    q.complete = true;
    render({ focus: "#step-title" });
    document.querySelector(".lead-form-panel").scrollIntoView({ block: "start" });
  }
});
document.addEventListener("click", (event) => {
  const dialog = event.target.closest("dialog");
  if (dialog && event.target === dialog) closeDialog();
});
window.addEventListener("popstate", () => {
  loadRoute();
  render({ focus: "#main", scroll: true });
});
loadRoute();
render();
