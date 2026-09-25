import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { root, build } from "./build.mjs";
import { parseRoute, documentHTML, renderPage } from "../src/render.js";
const production = process.argv.includes("--production");
if (production) await build();
const mime = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".html": "text/html",
  ".txt": "text/plain",
  ".json": "application/json",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' blob: data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    );
    if (pathname.includes("..") || pathname.includes("\0")) {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }
    if (
      pathname.startsWith("/src/") ||
      pathname.startsWith("/assets/") ||
      pathname === "/robots.txt"
    ) {
      const base = production
        ? path.join(root, "dist")
        : pathname.startsWith("/assets/")
          ? path.join(root, "public")
          : root;
      const file = path.join(base, pathname);
      if (pathname === "/robots.txt" && !production) {
        res.setHeader("Content-Type", "text/plain");
        res.end("User-agent: *\nDisallow: /\n");
        return;
      }
      const data = await fs.readFile(file);
      res.setHeader(
        "Content-Type",
        mime[path.extname(file)] || "application/octet-stream",
      );
      res.setHeader(
        "Cache-Control",
        pathname.startsWith("/assets/") ? "public, max-age=3600" : "no-cache",
      );
      res.end(data);
      return;
    }
    const { lang, path: route } = parseRoute(pathname);
    const page = renderPage(lang, route);
    res.statusCode = page.notFound ? 404 : 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(documentHTML(lang, route));
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, "127.0.0.1", () =>
  console.log(`THERMOVA preview: http://localhost:${port}/hu/`),
);
