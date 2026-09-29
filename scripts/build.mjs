import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { documentHTML } from "../src/render.js";
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const routes = [
  "",
  "klimak",
  "hoszivattyuk",
  "valaszto",
  "ajanlat",
  "rendszer-ajanlat",
  "telepites",
  "szolgaltatasok",
  "rolunk",
  "tudastar",
  "kapcsolat",
  "adatkezeles",
];
export async function build() {
  const out = path.join(root, "dist");
  await fs.rm(out, { recursive: true, force: true });
  await fs.mkdir(out, { recursive: true });
  await fs.cp(path.join(root, "public"), out, { recursive: true });
  await fs.cp(path.join(root, "src"), path.join(out, "src"), {
    recursive: true,
  });
  // The public site is enquiry-led. Internal catalogue data and product photos
  // stay in the working project but are deliberately excluded from deployment.
  await Promise.all([
    fs.rm(path.join(out, "assets", "products"), { recursive: true, force: true }),
    fs.rm(path.join(out, "src", "catalogue.js"), { force: true }),
    fs.rm(path.join(out, "src", "catalogue-products.js"), { force: true }),
    fs.rm(path.join(out, "src", "domain.js"), { force: true }),
    fs.rm(path.join(out, "src", "product-images.js"), { force: true }),
  ]);
  for (const lang of ["hu", "en"])
    for (const route of routes) {
      const folder = path.join(out, lang, route);
      await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(
        path.join(folder, "index.html"),
        documentHTML(lang, route),
      );
    }
  await fs.writeFile(path.join(out, "index.html"), documentHTML("hu", ""));
  await fs.writeFile(path.join(out, "404.html"), documentHTML("hu", "404"));
  await fs.writeFile(
    path.join(out, "robots.txt"),
    "User-agent: *\nAllow: /\nSitemap: https://thermova.hu/sitemap.xml\n",
  );
  const publicRoutes = [
    "",
    "klimak",
    "hoszivattyuk",
    "telepites",
    "szolgaltatasok",
    "rolunk",
    "tudastar",
    "kapcsolat",
  ];
  const sitemapUrls = ["hu", "en"].flatMap((lang) =>
    publicRoutes.map(
      (route) =>
        `<url><loc>https://thermova.hu/${lang}/${route ? route + "/" : ""}</loc></url>`,
    ),
  );
  await fs.writeFile(
    path.join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.join("")}</urlset>`,
  );
  console.log(`Built ${routes.length * 2 + 1} static pages in dist/.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
