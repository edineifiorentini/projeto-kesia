import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(rootDir, "out");
const resolvedOutDir = path.resolve(outDir);

if (!resolvedOutDir.startsWith(`${rootDir}${path.sep}`)) {
  throw new Error(`Refusing to write outside project: ${resolvedOutDir}`);
}

const normalizeBasePath = (value) => {
  if (!value || value === "/") {
    return "";
  }

  return `/${value.replace(/^\/+|\/+$/g, "")}`;
};

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? "/projeto-kesia");
const htmlPath = path.join(rootDir, ".next", "server", "app", "index.html");
const rscPath = path.join(rootDir, ".next", "server", "app", "index.rsc");
const publicDir = path.join(rootDir, "public");
const nextStaticDir = path.join(rootDir, ".next", "static");

let html = await readFile(htmlPath, "utf8");

if (basePath) {
  html = html
    .replaceAll('"/_next/', `"${basePath}/_next/`)
    .replaceAll("'/_next/", `'${basePath}/_next/`)
    .replaceAll('"/videos/', `"${basePath}/videos/`)
    .replaceAll("'/videos/", `'${basePath}/videos/`)
    .replaceAll('"/favicon.ico', `"${basePath}/favicon.ico`)
    .replaceAll("'/favicon.ico", `'${basePath}/favicon.ico`)
    .replaceAll('"/booking/', `"${basePath}/booking/`)
    .replaceAll("'/booking/", `'${basePath}/booking/`)
    .replaceAll('"/login"', `"${basePath}/login"`)
    .replaceAll("'/login'", `'${basePath}/login'`);
}

if (html.includes("/_next/image")) {
  throw new Error(
    "GitHub Pages build still contains /_next/image URLs. Run with GITHUB_PAGES=true so Next emits unoptimized remote images.",
  );
}

await rm(outDir, { recursive: true, force: true });
await mkdir(path.join(outDir, "_next"), { recursive: true });

await writeFile(path.join(outDir, ".nojekyll"), "");
await writeFile(path.join(outDir, "index.html"), html);
await writeFile(path.join(outDir, "404.html"), html);

await cp(nextStaticDir, path.join(outDir, "_next", "static"), { recursive: true });
await cp(publicDir, outDir, { recursive: true });
await cp(rscPath, path.join(outDir, "index.rsc"));

console.log(`GitHub Pages preview exported to ${outDir}`);
