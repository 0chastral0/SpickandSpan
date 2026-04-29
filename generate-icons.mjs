/**
 * One-shot icon generator: takes logo.png (any size, any aspect ratio) and
 * produces square home-screen icons by padding it on a brand-blue gradient
 * canvas. Also produces apple-touch-icon and a square logo for in-app use.
 *
 * Run: node pwa-shell/generate-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPath = resolve(__dirname, 'logo.png');
const svgFallback = resolve(__dirname, 'icon.svg');

const useLogo = existsSync(logoPath);
const sourceBuf = useLogo ? readFileSync(logoPath) : readFileSync(svgFallback);
console.log(useLogo ? '✓ Using logo.png' : '✓ Using icon.svg fallback');

async function makeSquareIcon(outName, size, padPct = 0.06) {
  const inner = Math.round(size * (1 - padPct * 2));
  const logoResized = await sharp(sourceBuf, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const offset = Math.round((size - inner) / 2);
  const png = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logoResized, top: offset, left: offset }])
    .png()
    .toBuffer();
  writeFileSync(resolve(__dirname, outName), png);
  console.log(`  ${outName} (${size}×${size}, ${(png.length / 1024).toFixed(1)} KB)`);
}

async function makeFlatLogo(outName, height) {
  // Transparent-background, scaled-by-height version for in-app use (Sidebar/Topbar)
  const png = await sharp(sourceBuf, { density: 384 })
    .resize({ height, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  writeFileSync(resolve(__dirname, outName), png);
  console.log(`  ${outName} (h=${height}, ${(png.length / 1024).toFixed(1)} KB)`);
}

console.log('Generating square icons (transparent background):');
await makeSquareIcon('icon-192.png', 192);
await makeSquareIcon('icon-512.png', 512);
await makeSquareIcon('apple-touch-icon.png', 180);

console.log('Generating flat logo (transparent bg) for in-app use:');
await makeFlatLogo('logo-flat.png', 96);

console.log('Done.');
