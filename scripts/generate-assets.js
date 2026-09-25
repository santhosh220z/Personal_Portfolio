// Atelier Zero — optional bespoke collage asset generation via gpt-image-2.
//
// Reads inputs.json and derives up to 16 editorial collage prompts in the
// Atelier Zero style, then requests `gpt-image-2` (OpenAI Images API).
// PNGs are written to scripts/assets/collage/{slug}.png and picked up
// automatically by the composer when present.
//
// Requires OPENAI_API_KEY. Run:
//   node scripts/generate-assets.js          # generate all 16 assets
//   node scripts/generate-assets.js --dry    # print prompts, generate nothing
//
// Per-project figure `src` fields stay null: the composer falls back to
// procedural plates until generated raster assets are found.

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE = "https://api.openai.com/v1/images/generations";
const MODEL = "gpt-image-2";
const ASSET_DIR = fileURLToPath(new URL("./assets/collage/", import.meta.url));
const INPUTS_URL = new URL("../inputs.json", import.meta.url);

// Editorial style guardrails are constant; subject matter is drawn from the
// brief. The resulting prompts share one dialect with the DESIGN.md.
export async function derivePrompts(inputs) {
  const P = [];
  const p = inputs.person;
  const proj = (i) => (inputs.projects || []).find((x) => x.index === i) || null;
  const voice =
    "Flat two-colour risograph-style editorial collage on warm cream paper (#F4F0E6), ink black (#17150F), a single vermilion accent (#E24A1F), halftone dot raster, torn-edge collage, imperfect registration, film grain, oversized italic serif numerals, minimal mono captions, no gradients, no photorealism, no 3D.";

  P.push({
    slug: "hero-collage",
    caption: "Hero — portrait as editorial plate",
    prompt:
      "Cover plate of an independent systems magazine: portrait collage of a young South-Indian machine-learning engineer in profile, flat linocut shapes over halftone, an overprinted oversized italic serif initial, one ruled margin. " + voice,
  });

  P.push({
    slug: "portrait-plate",
    caption: "Portrait — halftone study",
    prompt:
      "Coarse black-and-vermilion halftone portrait study of a young man's face looking slightly off-camera, one translucent vermilion circle overlaid, small hand-drawn crosshair, paper grain, tears at the edges, figure plate in a print monograph. " + voice,
  });

  P.push({
    slug: "field-study",
    caption: "Field study — annotation desk",
    prompt:
      "Collage of an annotation desk at night: laptop glowing with a hand-landmark skeleton overlay, printed dataset sheets, a ruler, coffee stains, one vermilion sticky note, torn paper scraps. " + voice,
  });

  P.push({
    slug: "deepfake-plate",
    caption: "Fig. 01 — The Counterfeit Face",
    prompt:
      +"Diagram plate: a wireframe neural network dissolving into a seam of two half-faces, one developed photograph, one flat black silhouette, index numeral '01' in oversized italic serif, registration marks, halftone raster. " + voice,
  });

  P.push({
    slug: "signspeak-plate",
    caption: "Fig. 02 — Sign Speak",
    prompt:
      +"Print study of a hand mid-gesture: line-drawn palm with a hairline landmark skeleton, one finger extended and craned in vermilion, fine mono ruled grid behind, caption plate 'Fig. 02'. " + voice,
  });

  P.push({
    slug: "chat-plate",
    caption: "Fig. 03 — Designing a Conversationalist",
    prompt:
      +"Collage of speech-bubble fragments and a long printed dialogue thread collaged over a minimal profile line-drawing of a head, torn paper strips, overprint registration mark, index numeral '03'. " + voice,
  });

  P.push({
    slug: "stroke-plate",
    caption: "Fig. 04 — The Quiet Warning",
    prompt:
      +"Statistical plate: measured bar-chart study of medical risk, flat black bars, a single vermilion bar standing out, fine ruled grid, big italic serif numeral '04', small mono captions, clinical journal page. " + voice,
  });

  P.push({
    slug: "studio-map",
    caption: "Studio — four rooms",
    prompt:
      +"Floor-plan print: four irregular rooms drawn as flat black linework, one vermilion door each, furniture drawn like tiny pictograms, roman numerals I–IV in large italic serif, ruled border. " + voice,
  });

  P.push({
    slug: "marginalia",
    caption: "Marginalia note",
    prompt:
      +"Close crop of a working notebook: printed serif body text, a hand-drawn vermilion underline, a circled correction, a paperclip, feeder marks, a bleeding '92%' rubber stamp. " + voice,
  });

  const plateMoods = [
    ["plate-halftone", "a dense halftone dot raster field, one dot warped large and vermilion"],
    ["plate-scanlines", "a bold scanline field, fine black horizontal rules, one group of lines pulled into vermilion"],
    ["plate-iso", "a topographic contour study of layered wavy lines, one contour chain vermilion, survey-plate labels"],
    ["plate-network", "a hand-drawn wireframe network of nodes and edges, one node vermilion, mono labels, systems-diagram plate"],
    ["plate-bars", "an abstract spectrum-bar block, measured black columns, one column vermilion, ruler marks, index numerals"],
    ["plate-rings", "concentric aperture rings drawn eccentric in black ink, one ring vermilion, registration cross"],
    ["plate-crosshair", "a sighting crosshair with offset registration marks, thin black rules, vermilion target dot, crop marks"],
  ];
  for (const [slug, mood] of plateMoods) {
    P.push({ slug, caption: "Plate — " + slug.replace("plate-", ""), prompt: mood + ". " + voice });
  }

  return P.slice(0, 16);
}

export async function requestImage(prompt, key, size = "1536x1024") {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      quality: "hd",
      size,
      n: 1,
      response_format: "b64_json",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`gpt-image-2 request failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("gpt-image-2 returned no image payload");
  return Buffer.from(b64, "base64");
}

async function main() {
  const inputs = JSON.parse(await readFile(INPUTS_URL, "utf8"));
  const prompts = await derivePrompts(inputs);
  const dry = process.argv.includes("--dry");

  if (!dry) await mkdir(ASSET_DIR, { recursive: true });

  for (const [i, item] of prompts.entries()) {
    console.log(`\n[${String(i + 1).padStart(2, "0")}/16] ${item.slug} — ${item.caption}`);
    console.log(`  ${item.prompt.slice(0, 180)}…`);
    if (dry) continue;

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      console.warn("  ! OPENAI_API_KEY missing — skipping. Run with --dry to preview prompts.");
      continue;
    }
    try {
      const png = await requestImage(item.prompt, key);
      const slug = item.slug;
      const w = await writeFile(ASSET_DIR + slug + ".png", png);
      console.log(`  ✓ wrote ${slug}.png (${png.length} bytes)`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }

  if (dry) {
    console.log(`\n${prompts.length} prompts derived from inputs.json — none generated (--dry).`);
    console.log("Set OPENAI_API_KEY and run without --dry to pull gpt-image-2 assets, then re-compose.");
  } else {
    console.log("\nDone. Re-run scripts/compose.js to fold these plates into the page.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});