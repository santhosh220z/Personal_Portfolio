// Atelier Zero — portfolio composer CLI.
// Pure `compose(inputs, ctx)` lives in scripts/lib/sections.js.
// This script handles I/O: reads inputs, resolves assets, calls compose,
// writes dist/index.html, and mirrors to apps/landing-page/.

import { readFile, writeFile, mkdir, access, cp } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, extname } from "node:path";
import { compose } from "./lib/sections.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const INPUTS_PATH = resolve(ROOT, "inputs.json");
const DIST_DIR = resolve(ROOT, "dist");
const OUTPUT_PATH = resolve(DIST_DIR, "index.html");
const MIRROR_DIR = resolve(ROOT, "apps", "landing-page");
const MIRROR_OUTPUT = resolve(MIRROR_DIR, "index.html");
const ASSET_DIR = resolve(ROOT, "scripts", "assets", "collage");

// Read a file and return base64 data URI if it exists and is reasonably sized.
async function embedAsset(relPath, maxBytes = 350000) {
  const abs = resolve(ROOT, relPath);
  try {
    await access(abs);
    const buf = await readFile(abs);
    if (buf.length > maxBytes) {
      console.warn(`  ⚠ ${relPath} is ${Math.round(buf.length / 1024)} KB — exceeding ${maxBytes / 1024} KB limit; skipping embed.`);
      return null;
    }
    const ext = extname(abs).toLowerCase().slice(1);
    const mime = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// Check if a generated collage asset exists for a given slug.
async function collageAsset(slug) {
  const abs = resolve(ASSET_DIR, slug + ".png");
  try {
    await access(abs);
    const buf = await readFile(abs);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

async function buildContext(inputs) {
  const ctx = { images: {} };

  // Portrait
  if (inputs.person?.portrait?.src) {
    const src = inputs.person.portrait.src;
    ctx.images.portrait = (await embedAsset(src)) || src;
  }

  // Project figures: prefer explicit src; else check for collage raster for plate type
  for (const pr of inputs.projects || []) {
    if (pr.figure?.src) {
      pr.figure.src = (await embedAsset(pr.figure.src)) || pr.figure.src;
    } else if (pr.figure?.plate) {
      const slug = pr.figure.plate;
      const collaged = await collageAsset(slug);
      if (collaged) {
        // Mutate the figure src so the renderer uses the raster
        pr.figure.src = collaged;
      }
    }
  }

  return ctx;
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function main() {
  const args = process.argv.slice(2);
  const pretty = args.includes("--pretty");
  const noMirror = args.includes("--no-mirror");
  const outArg = args.find((a) => a.startsWith("--out="));
  const customOut = outArg ? resolve(ROOT, outArg.split("=")[1]) : OUTPUT_PATH;
  const mirrorArg = args.find((a) => a.startsWith("--app-path="));
  const customMirror = mirrorArg ? resolve(ROOT, mirrorArg.split("=")[1]) : MIRROR_OUTPUT;

  console.log("→ Reading brief…");
  const inputs = JSON.parse(await readFile(INPUTS_PATH, "utf8"));

  console.log("→ Resolving assets…");
  const ctx = await buildContext(inputs);

  console.log("→ Composing document…");
  const html = compose(inputs, ctx);

  console.log(`→ Writing ${customOut}`);
  await ensureDir(dirname(customOut));
  await writeFile(customOut, html, "utf8");

  if (!noMirror) {
    console.log(`→ Mirroring to ${customMirror}`);
    await ensureDir(dirname(customMirror));
    await writeFile(customMirror, html, "utf8");
  }

  const kb = Math.round(Buffer.byteLength(html, "utf8") / 1024);
  console.log(`\n✓ Done — ${kb} KB single-file HTML.`);
  console.log(`  Open: ${customOut}`);
  if (!noMirror) console.log(`  Mirror: ${customMirror}`);
}

main().catch((err) => {
  console.error("\n✗ Compose failed:", err);
  process.exitCode = 1;
});