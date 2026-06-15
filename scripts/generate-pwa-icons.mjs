import sharp from "sharp";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const source = join(publicDir, "adaptive-icon.png");

const sizes = [192, 512];

mkdirSync(publicDir, { recursive: true });

for (const size of sizes) {
  const out = join(publicDir, `icon-${size}.png`);
  await sharp(source)
    .resize(size, size, { fit: "contain", background: { r: 26, g: 18, b: 32, alpha: 1 } })
    .png()
    .toFile(out);
  console.log(`Wrote ${out}`);
}
