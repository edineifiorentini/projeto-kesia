import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const TERRACOTTA = "#974315";
const PEARL = "#F0EDE4";
const sourcePath = resolve(process.argv[2] ?? "assets/brand/favicon-master.svg");
const publicDir = resolve("public");

const source = await readFile(sourcePath, "utf8");
const rectSource = source.match(/<rect\b[\s\S]*?\/>/)?.[0];
const paths = [...source.matchAll(/<path\b[\s\S]*?\bd="([^"]+)"[\s\S]*?\/>/g)].map(
  (match) => match[1],
);

if (!rectSource || paths.length < 2) {
  throw new Error("The master favicon must contain one rounded rectangle and two paths.");
}

const attr = (name) => {
  const value = rectSource.match(new RegExp(`${name}="([^"]+)"`))?.[1];
  if (!value) throw new Error(`Missing ${name} on the master background.`);
  return value;
};

const rect = {
  x: attr("x"),
  y: attr("y"),
  width: attr("width"),
  height: attr("height"),
  rx: attr("rx"),
};
const [monogram, sparkle] = paths;

function artwork(background, foreground) {
  return `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" rx="${rect.rx}" fill="${background}"/>
  <path d="${monogram}" fill="${foreground}"/>
  <path d="${sparkle}" fill="${foreground}"/>`;
}

function faviconSvg(background, foreground) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
  <title id="title">Favicon Kesia Dutra</title>
  <desc id="desc">Monograma Kesia Dutra com brilho de quatro pontas.</desc>
  ${artwork(background, foreground)}
</svg>
`;
}

const primary = faviconSvg(TERRACOTTA, PEARL);
const alternative = faviconSvg(PEARL, TERRACOTTA);
const monochrome = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
  <g fill="#000000" transform="scale(0.03125)">
    <path d="${monogram}"/>
    <path d="${sparkle}"/>
  </g>
</svg>
`;
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g transform="translate(51.2 51.2) scale(0.8)">
    ${artwork(TERRACOTTA, PEARL)}
  </g>
</svg>
`;
const smallPrimary = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" rx="${rect.rx}" fill="${TERRACOTTA}"/>
  <path d="${monogram}" fill="${PEARL}" transform="translate(250 250) scale(1.2) translate(-250 -250)"/>
  <path d="${sparkle}" fill="${PEARL}" transform="translate(389 131) scale(1.12) translate(-389 -131)"/>
</svg>
`;

function render(svg, size) {
  return Buffer.from(
    new Resvg(svg, {
      fitTo: { mode: "width", value: size },
      imageRendering: 0,
    })
      .render()
      .asPng(),
  );
}

function createIco(images) {
  const headerSize = 6 + images.length * 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = headerSize;
  images.forEach(({ size, bytes }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(bytes.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += bytes.length;
  });

  return Buffer.concat([header, ...images.map(({ bytes }) => bytes)]);
}

const brandDir = resolve(publicDir, "brand");
const iconsDir = resolve(publicDir, "icons");
await mkdir(brandDir, { recursive: true });
await mkdir(iconsDir, { recursive: true });

await Promise.all([
  writeFile(resolve(brandDir, "favicon-primary.svg"), primary),
  writeFile(resolve(brandDir, "favicon-alternative.svg"), alternative),
  writeFile(resolve(brandDir, "favicon-monochrome.svg"), monochrome),
  writeFile(resolve(publicDir, "apple-touch-icon.png"), render(primary, 180)),
  writeFile(resolve(iconsDir, "icon-192.png"), render(primary, 192)),
  writeFile(resolve(iconsDir, "icon-512.png"), render(primary, 512)),
  writeFile(resolve(iconsDir, "icon-maskable-512.png"), render(maskable, 512)),
]);

const icoImages = [16, 32, 48].map((size) => ({
  size,
  bytes: render(size === 16 ? smallPrimary : primary, size),
}));
await writeFile(resolve(publicDir, "favicon.ico"), createIco(icoImages));

console.log(`Favicon assets generated from ${sourcePath}`);
