import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

/**
 * Serves ./out under /discount.com so the end-to-end run sees exactly the
 * paths GitHub Pages serves, base path included. Dependency-free on purpose:
 * one less package between the build and the tests that check it.
 */
const ROOT = join(process.cwd(), "out");
const BASE = "/discount.com";
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const send = (res, status, body, type = "text/plain; charset=utf-8") => {
  res.writeHead(status, { "content-type": type });
  res.end(body);
};

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === BASE) pathname = `${BASE}/`;
  if (!pathname.startsWith(`${BASE}/`)) {
    return send(res, 404, `Not found outside ${BASE}`);
  }

  const rel = normalize(pathname.slice(BASE.length)).replace(/^([/\\])+/, "");
  if (rel.includes("..")) return send(res, 403, "Forbidden");

  const target = join(ROOT, rel);
  const candidates = [
    target,
    join(target, "index.html"),
    `${target}.html`,
  ];

  const file = candidates.find(
    (c) => existsSync(c) && statSync(c).isFile(),
  );

  if (!file) {
    const notFound = join(ROOT, "404.html");
    return existsSync(notFound)
      ? send(res, 404, readFileSync(notFound), TYPES[".html"])
      : send(res, 404, "Not found");
  }

  send(
    res,
    200,
    readFileSync(file),
    TYPES[extname(file)] ?? "application/octet-stream",
  );
}).listen(PORT, () => {
  console.log(`static export served at http://localhost:${PORT}${BASE}/`);
});
