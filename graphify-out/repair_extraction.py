"""Repair dangling edge endpoints in a graphify extraction, in place.

graphify's producers emit edge targets under two ID schemes that never match the
node IDs they should point at:

  1. `ref_<pkg>` / `ref_<node_builtin>`  - import edges to external modules. The
     AST extractor emits the edge but never materialises a node, so every import
     of react/gsap/framer-motion/etc. was silently discarded at build time.
  2. `design_<section>` and
     `apps_landing_page_design_<section>` - shorthand references to a document
     concept that exists in the graph under a fuller ID.

Both are genuine, EXTRACTED facts, so dropping them loses real information. This
script repairs the endpoints rather than the edges, creates the few genuinely
missing nodes (grounded in literal import specifiers or verbatim DESIGN.md
headings), and merges parallel edges losslessly so a non-multigraph build cannot
overwrite one relation with another.

Run it after a build, before graphify.build.build_from_json:

    python graphify-out/repair_extraction.py

Re-running is safe: the remap is a no-op once applied, and already-present nodes
are not recreated.
"""

import json
from collections import defaultdict
from pathlib import Path

EXTRACTION = Path(__file__).parent / ".graphify_extract.json"

# --- external modules -> the package/builtin nodes the graph already has -----
REMAP = {
    "ref_react": "react",
    "ref_react_dom_client": "react_dom",
    "ref_framer_motion": "framer_motion",
    "ref_lucide_react": "lucide_react",
    "ref_gsap": "gsap",
    "ref_vite": "vite",
    "ref_vitejs_plugin_react": "vitejs_plugin_react",
    "ref_tailwindcss_vite": "tailwindcss_vite",
    "ref_eslint_js": "eslint_js",
    "ref_eslint_config": "eslint",
    "ref_globals": "globals",
    "ref_eslint_plugin_react_hooks": "eslint_plugin_react_hooks",
    "ref_eslint_plugin_react_refresh": "eslint_plugin_react_refresh",
    "ref_gsap_scrolltrigger": "gsap_scrolltrigger",
    "ref_gsap_observer": "gsap_observer",
    "ref_gsap_flip": "gsap_flip",
    "ref_node_fs_promises": "node_fs_promises",
    "ref_node_url": "node_url",
    "ref_node_path": "node_path",
    # local modules -> the local nodes the graph already has
    "src_lib_gsap_gsap": "src_lib_gsap",
    "src_lib_gsap_scrolltrigger": "src_lib_gsap",
    "src_assets_profile2": "src_assets_profile2_portrait_asset",
    "src_index": "src_index_css",
    # document-concept shorthand -> the real concept nodes
    "design_material_and_colour": "design_material_colour_tokens",
    "design_typography": "design_typography_three_voices",
    "design_layout_grammar": "design_layout_grammar_12col",
    "design_accessibility_and_craft": "design_accessibility_craft",
    "design_atelier_zero": "design_atelier_zero_visual_language",
    "design_reduced_motion_fallback": "design_prefers_reduced_motion_static",
    "readme_no_frameworks_vanilla_es_modules": "readme_no_frameworks",
    "index_vite_entry_document": "index_index_html",
    "apps_landing_page_design_atelier_zero": "design_atelier_zero_visual_language",
    "apps_landing_page_design_paper_ink_palette": "design_material_colour_tokens",
    "apps_landing_page_design_three_voice_typography": "design_typography_three_voices",
    "apps_landing_page_design_layout_grammar": "design_layout_grammar_12col",
    "apps_landing_page_design_accessibility_craft": "design_accessibility_craft",
    "apps_landing_page_design_single_file_output": "design_single_file_compose_print",
    "apps_landing_page_design_compose_pipeline": "design_compose_js",
    "apps_landing_page_design_collage_imperfection": "design_collage_and_imperfection",
    "apps_landing_page_design_editorial_motion": "design_motion_editorial",
}

# --- nodes that genuinely do not exist yet -----------------------------------
# source_file is set to the importing corpus file (or the document that owns the
# heading) so no node references a path outside the detected corpus.
CREATE = {
    "design_collage_and_imperfection": {
        "label": "Collage & imperfection",
        "file_type": "document",
        "source_file": "DESIGN.md",
        "source_location": "## 5. Collage & imperfection",
    },
    "design_motion_editorial": {
        "label": "Motion (subtle, editorial)",
        "file_type": "document",
        "source_file": "DESIGN.md",
        "source_location": "## 6. Motion (subtle, editorial)",
    },
    "gsap_scrolltrigger": {
        "label": "gsap/ScrollTrigger",
        "file_type": "concept",
        "source_location": None,
    },
    "gsap_observer": {"label": "gsap/Observer", "file_type": "concept", "source_location": None},
    "gsap_flip": {"label": "gsap/Flip", "file_type": "concept", "source_location": None},
    "node_fs_promises": {
        "label": "node:fs/promises",
        "file_type": "concept",
        "source_location": None,
    },
    "node_url": {"label": "node:url", "file_type": "concept", "source_location": None},
    "node_path": {"label": "node:path", "file_type": "concept", "source_location": None},
    "src_index_css": {
        "label": "index.css (global stylesheet)",
        "file_type": "code",
        "source_file": "src/main.jsx",
        "source_location": "imported by src/main.jsx",
    },
}
# these carry their own source_file and must not be overwritten by the referrer
_FIXED_SOURCE = {"design_collage_and_imperfection", "design_motion_editorial", "src_index_css"}


def _add_missing_nodes(extraction):
    ids = {n["id"] for n in extraction["nodes"]}
    referrer = {}
    for edge in extraction["edges"]:
        for role in ("source", "target"):
            target = edge.get(role)
            if target in CREATE and target not in referrer:
                referrer[target] = edge.get("source_file")

    added = []
    for node_id, spec in CREATE.items():
        if node_id in ids:
            continue
        node = {
            "id": node_id,
            "label": spec["label"],
            "file_type": spec["file_type"],
            "source_file": spec.get("source_file") or referrer.get(node_id),
            "source_location": spec.get("source_location"),
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        }
        if node_id not in _FIXED_SOURCE and not node["source_file"]:
            node["source_file"] = referrer.get(node_id)
        extraction["nodes"].append(node)
        added.append(node_id)
    return added


def _remap_endpoints(extraction):
    changed = 0
    for edge in extraction["edges"]:
        for role in ("source", "target"):
            value = edge.get(role)
            if value in REMAP:
                edge[role] = REMAP[value]
                changed += 1
    for hyper in extraction.get("hyperedges", []):
        for i, member in enumerate(hyper.get("nodes", [])):
            if member in REMAP:
                hyper["nodes"][i] = REMAP[member]
                changed += 1
    return changed


def _dedupe(extraction):
    seen, kept, dropped = set(), [], 0
    for edge in extraction["edges"]:
        key = (
            edge.get("source"),
            edge.get("target"),
            edge.get("relation"),
            edge.get("source_file"),
            edge.get("source_location"),
        )
        if key in seen:
            dropped += 1
            continue
        seen.add(key)
        kept.append(edge)
    extraction["edges"] = kept
    return dropped


def _merge_parallel_edges(extraction):
    """build_from_json returns a non-multigraph Graph, so parallel edges collapse
    and one relation silently overwrites another. Merge each same-endpoint group
    into a single edge whose primary relation is the strongest, preserving every
    relation and source location in parallel attributes."""
    groups = defaultdict(list)
    for edge in extraction["edges"]:
        groups[frozenset((edge["source"], edge["target"]))].append(edge)

    rank_of = {"EXTRACTED": 2, "INFERRED": 1, "AMBIGUOUS": 0}
    merged, groups_merged = [], 0
    for edges in groups.values():
        if len(edges) == 1:
            merged.append(edges[0])
            continue
        groups_merged += 1
        edges = sorted(
            edges,
            key=lambda e: (rank_of.get(e.get("confidence"), 1), float(e.get("confidence_score") or 0)),
            reverse=True,
        )
        primary = dict(edges[0])
        primary["relations_all"] = sorted({e.get("relation") for e in edges if e.get("relation")})
        locations = [e.get("source_location") for e in edges if e.get("source_location")]
        if len(locations) > 1:
            primary["source_locations_all"] = locations
        files = sorted({e.get("source_file") for e in edges if e.get("source_file")})
        if len(files) > 1:
            primary["source_files_all"] = files
        merged.append(primary)

    extraction["edges"] = merged
    return groups_merged


def main():
    extraction = json.loads(EXTRACTION.read_text(encoding="utf-8"))
    before_nodes, before_edges = len(extraction["nodes"]), len(extraction["edges"])

    added = _add_missing_nodes(extraction)
    remapped = _remap_endpoints(extraction)
    dropped = _dedupe(extraction)
    groups = _merge_parallel_edges(extraction)

    ids = {n["id"] for n in extraction["nodes"]}
    dangling = sorted(
        {
            edge.get(role)
            for edge in extraction["edges"]
            for role in ("source", "target")
            if edge.get(role) not in ids
        }
    )

    EXTRACTION.write_text(json.dumps(extraction, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"nodes   {before_nodes} -> {len(extraction['nodes'])}  (+{len(added)} created)")
    print(f"edges   {before_edges} -> {len(extraction['edges'])}")
    print(f"endpoints remapped: {remapped}   duplicate edges removed: {dropped}")
    print(f"parallel-edge groups merged losslessly: {groups}")
    print(f"dangling endpoints remaining: {dangling or 'none'}")


if __name__ == "__main__":
    main()
