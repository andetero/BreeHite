import fs from "node:fs";
import path from "node:path";

const dir = "assets/horses";
const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"]);

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = fs.readdirSync(dir)
  .filter(name => allowed.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const titleCase = value => value
  .replace(/\.[^.]+$/, "")
  .replace(/[-_]+/g, " ")
  .replace(/\b\w/g, c => c.toUpperCase());

const photos = files.map(name => ({
  src: `${dir}/${name}`,
  alt: `Horseback riding photo: ${titleCase(name)}`,
  caption: titleCase(name),
  horse: true
}));

fs.writeFileSync("photos.json", JSON.stringify(photos));
console.log(`Wrote ${photos.length} photos to photos.json`);
