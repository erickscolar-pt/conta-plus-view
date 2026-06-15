import sharp from "sharp";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const source = join(publicDir, "adaptive-icon.png");

/** cp-base — cor de fundo do sistema Conta+ */
const CP_BASE = "#1A1216";

async function buildIcon(size, paddingRatio = 0.1) {
  const padding = Math.round(size * paddingRatio);
  const inner = size - padding * 2;

  const logo = await sharp(source)
    .resize(inner, inner, { fit: "contain", background: CP_BASE })
    .flatten({ background: CP_BASE })
    .toBuffer();

  const out = join(publicDir, `icon-${size}.png`);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: CP_BASE,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .flatten({ background: CP_BASE })
    .removeAlpha()
    .png({ compressionLevel: 9, force: true })
    .toFile(out);

  console.log(`Wrote ${out}`);
}

async function buildMaskableIcon(size) {
  const paddingRatio = 0.22;
  const padding = Math.round(size * paddingRatio);
  const inner = size - padding * 2;

  const logo = await sharp(source)
    .resize(inner, inner, { fit: "contain", background: CP_BASE })
    .flatten({ background: CP_BASE })
    .toBuffer();

  const out = join(publicDir, `icon-${size}-maskable.png`);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: CP_BASE,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .flatten({ background: CP_BASE })
    .removeAlpha()
    .png({ compressionLevel: 9, force: true })
    .toFile(out);

  console.log(`Wrote ${out}`);
}

async function buildAppleTouchIcon() {
  const size = 180;
  const padding = Math.round(size * 0.1);
  const inner = size - padding * 2;

  const logo = await sharp(source)
    .resize(inner, inner, { fit: "contain", background: CP_BASE })
    .flatten({ background: CP_BASE })
    .toBuffer();

  const out = join(publicDir, "apple-touch-icon.png");
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: CP_BASE,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .flatten({ background: CP_BASE })
    .removeAlpha()
    .png({ compressionLevel: 9, force: true })
    .toFile(out);

  console.log(`Wrote ${out}`);
}

mkdirSync(publicDir, { recursive: true });

for (const size of [192, 512]) {
  await buildIcon(size);
  await buildMaskableIcon(size);
}

await buildAppleTouchIcon();
