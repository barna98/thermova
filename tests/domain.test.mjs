import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterProducts,
  recommendations,
  config,
  totals,
  newQuote,
  newUnit,
  reviewRequired,
  safeCart,
  cartTotals,
  cartKey,
} from "../src/domain.js";
import { renderPage, documentHTML } from "../src/render.js";
import { routes } from "../scripts/build.mjs";
import { products } from "../src/catalogue.js";

test("catalogue contains the 20 supplied real models with traceable references", () => {
  assert.equal(products.length, 20);
  assert.equal(new Set(products.map((p) => p.id)).size, 20);
  assert.ok(products.every((p) => p.sku && p.sourceUrl && p.priceChecked));
  assert.ok(products.some((p) => p.sku === "FTXP35N / RXP35N"));
});

test("standard installation is 109000 HUF and totals are additive per unit", () => {
  assert.equal(config.installationPrice, 109000);
  assert.deepEqual(totals([newUnit("gree-pulse-pro-35"), newUnit("aux-gamma-26")]), {
    device: 381899,
    installation: 218000,
    total: 599899,
  });
});
test("filters respect size, heating use, budget and brand together", () => {
  assert.deepEqual(
    filterProducts({
      size: "30",
      mode: "heat",
      price: "low",
      brand: "Gree",
    }).map((p) => p.id),
    ["gree-comfort-pro-35"],
  );
  assert.equal(filterProducts({ size: "15", mode: "heat" }).length, 1);
  assert.equal(
    filterProducts({ mode: "both" }).some((p) => p.mode === "cool"),
    false,
  );
});
test("sorting is numeric and recommendations never relax incompatible requirements", () => {
  const list = filterProducts({ sort: "price-up" });
  assert.ok(list.every((p, i) => i === 0 || list[i - 1].price <= p.price));
  assert.deepEqual(
    recommendations({ size: "15", mode: "heat" }).map((p) => p.id),
    ["hisense-max-comfort-20"],
  );
  assert.ok(recommendations({ size: "30" }).length <= 3);
});
test("every multi-unit and heat pump project requires human review", () => {
  const ac = newQuote();
  Object.assign(ac.units[0], {
    height: "under3",
    access: "easy",
    outdoor: "wall",
  });
  assert.equal(reviewRequired(ac), false);
  ac.units.push({ ...ac.units[0] });
  assert.equal(reviewRequired(ac), true);
  assert.equal(reviewRequired(newQuote("hp")), true);
  ac.units.pop();
  ac.units[0].outdoor = "roof";
  assert.equal(reviewRequired(ac), true);
});
test("cart storage rejects unknown products and invalid quantities", () => {
  assert.deepEqual(
    safeCart([
      { id: "evil", qty: 1 },
      { id: "gree-pulse-pro-35", qty: 21 },
      { id: "gree-pulse-pro-35", qty: -1 },
      { id: "aux-gamma-26", qty: 2 },
    ]),
    [{ id: "aux-gamma-26", qty: 2, installation: false }],
  );
});
test("cart storage consolidates duplicate variants without exceeding the limit", () => {
  assert.deepEqual(
    safeCart([
      { id: "gree-pulse-pro-35", qty: 12, installation: true },
      { id: "gree-pulse-pro-35", qty: 12, installation: true },
      { id: "gree-pulse-pro-35", qty: 2, installation: false },
    ]),
    [
      { id: "gree-pulse-pro-35", qty: 20, installation: true },
      { id: "gree-pulse-pro-35", qty: 2, installation: false },
    ],
  );
});
test("a single device-only request does not require installation review", () => {
  const request = newQuote("device", "gree-pulse-pro-35");
  assert.equal(reviewRequired(request), false);
  request.units.push(newUnit("aux-gamma-26"));
  assert.equal(reviewRequired(request), true);
});
test("all public pages are rendered in both languages with exactly one h1", () => {
  for (const lang of ["hu", "en"])
    for (const path of routes) {
      const page = renderPage(lang, path);
      assert.equal(page.notFound, false, lang + "/" + path);
      assert.equal(
        (page.body.match(/<h1[ >]/g) || []).length,
        1,
        lang + "/" + path,
      );
      assert.ok(!page.body.includes("undefined"), lang + "/" + path);
      assert.ok(documentHTML(lang, path).includes(`lang="${lang}"`));
      assert.match(
        documentHTML(lang, path),
        /name="robots" content="(noindex,follow|index,follow)"/,
      );
    }
});
test("empty device request renders safely and unknown product is a 404", () => {
  const q = newQuote("device");
  q.units = [];
  assert.doesNotThrow(() => renderPage("hu", "keszulekigeny", { quote: q }));
  assert.equal(renderPage("hu", "klimak/missing").notFound, true);
  const notFound = documentHTML("hu", "404");
  assert.match(notFound, /rel="canonical" href="https:\/\/thermova.hu\/404.html"/);
  assert.ok(!notFound.includes('rel="alternate"'));
});
test("untrusted form values are escaped, files remain optional and completion is honest", () => {
  const q = newQuote();
  q.step = 3;
  q.note = "</textarea><script>alert(1)</script>";
  q.files = [{ name: "<img src=x onerror=alert(1)>", size: 100 }];
  const page = renderPage("hu", "ajanlat", { quote: q }).body;
  assert.ok(!page.includes("<script>alert(1)"));
  assert.ok(page.includes("&lt;script&gt;"));
  assert.ok(!/type="file"[^>]*required/.test(page));
  q.complete = true;
  assert.match(
    renderPage("en", "ajanlat", { quote: q }).body,
    /does not send data/,
  );
});

test("mixed cart adds installation only to selected variants", () => {
  const cart = [
    { id: "gree-pulse-pro-35", qty: 1, installation: false },
    { id: "gree-pulse-pro-35", qty: 2, installation: true },
  ];
  assert.notEqual(cartKey(cart[0]), cartKey(cart[1]));
  assert.deepEqual(cartTotals(cart), {
    device: 605997,
    installation: 218000,
    installedCount: 2,
    total: 823997,
  });
});
test("mixed quote keeps device-only lines and requires human review", () => {
  const q = newQuote();
  Object.assign(q.units[0], {
    height: "under3",
    access: "easy",
    outdoor: "wall",
  });
  q.deviceOnly = [{ id: "aux-gamma-26", qty: 1, installation: false }];
  assert.deepEqual(totals(q.units, q.deviceOnly), {
    device: 381899,
    installation: 109000,
    total: 490899,
  });
  assert.equal(reviewRequired(q), true);
});
