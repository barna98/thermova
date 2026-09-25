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

test("standard installation is 109000 HUF and totals are additive per unit", () => {
  assert.equal(config.installationPrice, 109000);
  assert.deepEqual(totals([newUnit("nordiq-35"), newUnit("aeris-26")]), {
    device: 549800,
    installation: 218000,
    total: 767800,
  });
});
test("filters respect size, heating use, budget and brand together", () => {
  assert.deepEqual(
    filterProducts({
      size: "30",
      mode: "heat",
      price: "high",
      brand: "Valtek",
    }).map((p) => p.id),
    ["valtek-35"],
  );
  assert.equal(filterProducts({ size: "15", mode: "heat" }).length, 0);
  assert.equal(
    filterProducts({ mode: "both" }).some((p) => p.mode === "cool"),
    false,
  );
});
test("sorting is numeric and recommendations never relax incompatible requirements", () => {
  const list = filterProducts({ sort: "price-up" });
  assert.ok(list.every((p, i) => i === 0 || list[i - 1].price <= p.price));
  assert.deepEqual(recommendations({ size: "15", mode: "heat" }), []);
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
      { id: "nordiq-35", qty: 21 },
      { id: "nordiq-35", qty: -1 },
      { id: "aeris-26", qty: 2 },
    ]),
    [{ id: "aeris-26", qty: 2, installation: false }],
  );
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
    }
});
test("empty device request renders safely and unknown product is a 404", () => {
  const q = newQuote("device");
  q.units = [];
  assert.doesNotThrow(() => renderPage("hu", "keszulekigeny", { quote: q }));
  assert.equal(renderPage("hu", "klimak/missing").notFound, true);
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
    { id: "nordiq-35", qty: 1, installation: false },
    { id: "nordiq-35", qty: 2, installation: true },
  ];
  assert.notEqual(cartKey(cart[0]), cartKey(cart[1]));
  assert.deepEqual(cartTotals(cart), {
    device: 989700,
    installation: 218000,
    installedCount: 2,
    total: 1207700,
  });
});
test("mixed quote keeps device-only lines and requires human review", () => {
  const q = newQuote();
  Object.assign(q.units[0], {
    height: "under3",
    access: "easy",
    outdoor: "wall",
  });
  q.deviceOnly = [{ id: "aeris-26", qty: 1, installation: false }];
  assert.deepEqual(totals(q.units, q.deviceOnly), {
    device: 549800,
    installation: 109000,
    total: 658800,
  });
  assert.equal(reviewRequired(q), true);
});
