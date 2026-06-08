# AGENTS.md

This file is for future coding agents working on the Macondo Archive project. It summarizes the current product surface, data model, and implementation conventions so follow-up work can start from the actual system shape.

## Project Overview

马孔多档案馆 is a static Astro site for structured reading and literary analysis of 《百年孤独》. It combines Markdown content collections with lightweight interactive islands.

Tech stack:

- Astro 5 static output
- React islands via `@astrojs/react`
- TypeScript strict config
- Pagefind search generated after build
- Global CSS in `src/styles/global.css`
- No heavy graph/visualization library is currently used

Useful commands:

- `npm run content:check` validates content references and private-source boundaries.
- `npm run content:index` regenerates `public/data/manifest.json`.
- `npm run build` runs content checks, index generation, Astro build, and Pagefind.
- `npm run dev` starts the local Astro dev server.

## Content Model

Content collections are defined in `src/content.config.ts`:

- `articles`: public research/reading articles with references to chapters, characters, motifs, themes, and events.
- `chapters`: 20 chapter archive entries with summaries, keywords, related events, characters, motifs, and articles.
- `characters`: character archive entries with id, slug, name, generation, role, summary, chapter/motif/article links, and family relations.
- `motifs`: motif archive entries with id, slug, name, summary, first appearance, key chapters, meanings, characters, events, and articles.
- `events`: structured narrative events. Each event has `id`, `chapter`, `order`, `title`, `summary`, `characters`, `motifs`, `themes`, and `relatedArticles`.

Important rule: relationship features should use structured Astro content entries, not ad hoc Markdown text parsing.

## Existing Product Features

### Reading Map Home

Route: `/`

The home page presents the archive as a reading map, with entry points into chapters, characters, motifs, themes, and articles. It uses content collections directly, the code-defined theme registry, and existing card/tag styles.

### Chapter Archive

Routes:

- `/chapters`
- `/chapters/[chapter]`

Chapter detail pages show:

- event timeline for the chapter
- linked characters and motifs
- chapter archive Markdown body
- related reading articles
- entry link to the full-book timeline with `?chapter={chapter}`

Core components/helpers:

- `src/components/chapter/ChapterTimeline.astro`
- `src/lib/content.ts`

### Character Archive

Routes:

- `/characters`
- `/characters/[slug]`

Character detail pages show:

- character Markdown archive
- relation index for chapters and motifs
- rule-generated fate line with 3-5 narrative phases when the character has enough structured events
- event timeline
- co-occurrence panel for characters, motifs, and chapter density
- related reading articles
- entry link to the global relation map with `?focus=character:{id}`
- entry link to the full-book timeline with `?character={id}`

Core data builder:

- `buildCharacterArchive` in `src/lib/relations.ts`

### Character Fate Line v1

Route: `/characters/[slug]`

Purpose: make each major character readable as a fate trajectory before the full event list. It answers “how this person is pushed through the narrative” using compact rule-generated phases.

Implementation:

- Data builder: `buildCharacterArchive` in `src/lib/relations.ts`
- Fate-line helper: private `buildCharacterFateLine` in `src/lib/relations.ts`
- Exported types: `CharacterFateLine`, `CharacterFatePhase`, and `CharacterFateEvent`
- UI: `src/components/relations/CharacterFateLine.astro`
- Styles: `.character-fate-*` blocks in `src/styles/global.css`

Data rules:

- Fate lines are generated only from structured `events` collection data plus resolved `motifs`.
- Do not parse Markdown bodies or add AI-generated prose for this feature.
- Do not modify content schemas for v1 fate-line work.
- Characters with fewer than 3 structured events do not render a fate-line section.
- Representative event links must use `timelineHref({ chapter, character }, eventId)`, producing links such as `/timeline?chapter=13&character=ursula-iguaran#chapter-13-01`.

Phase rules:

- Related character events are sorted by `chapter` and `order`.
- Phase count is deterministic: 3 phases for 3-7 events, 4 for 8-18 events, and 5 for 19+ events.
- Splits use contiguous event order and snap to nearby chapter breaks when possible.
- Phase titles combine position labels (`开端`, `扩张`, `转折`, `回落`, `终局`) with the dominant fate-function label.
- Fate functions are controlled labels scored from event `themes`, event `motifs`, and limited title keywords:
  - `出走`
  - `守护家族`
  - `战争化`
  - `情欲阻断`
  - `现代性侵入`
  - `记忆失明`
  - `死亡预兆`
  - `终局回返`
  - fallback `叙事共现`
- Each phase shows 1-3 function labels, top associated motifs capped at 4, and 2-4 representative events.

Responsive behavior:

- The fate-line section sits after the top character archive/relation grid and before “出场事件时间线”.
- Desktop: representative events use a compact two-column grid inside each phase.
- Mobile: phase headers stack, event cards become one column, and the section must not create page-level horizontal overflow.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/characters/ursula-iguaran`, `/characters/aureliano-buendia-colonel`, and `/characters/melquiades`
- Browser check that `/characters/apolinar-moscote` hides the section cleanly
- Browser check that representative event links open `/timeline?...#event-id`
- Browser check for mobile viewport behavior and no page-level horizontal overflow

### Motif Archive

Routes:

- `/motifs`
- `/motifs/[slug]`

Motif detail pages show:

- motif Markdown archive
- relation index for chapters and characters
- rule-generated evolution line with 3-5 phases when the motif has enough structured events
- motif evolution event timeline
- co-occurrence panel for characters, motifs, and chapter density
- related reading articles
- entry link to the global relation map with `?focus=motif:{id}`
- entry link to the full-book timeline with `?motif={id}`

Core data builder:

- `buildMotifArchive` in `src/lib/relations.ts`

### Motif Evolution Line v1

Route: `/motifs/[slug]`

Purpose: make each major motif readable as a transformation trajectory before the full event list. It answers “how this image or motif changes across the book” using compact rule-generated phases.

Implementation:

- Data builder: `buildMotifArchive` in `src/lib/relations.ts`
- Evolution-line helper: private `buildMotifEvolutionLine` in `src/lib/relations.ts`
- Exported types: `MotifEvolutionLine`, `MotifEvolutionPhase`, and `MotifEvolutionEvent`
- UI: `src/components/relations/MotifEvolutionLine.astro`
- Styles: `.motif-evolution-*` blocks in `src/styles/global.css`

Data rules:

- Evolution lines are generated only from structured `events` collection data plus resolved `characters`.
- Do not parse Markdown bodies or add AI-generated prose for this feature.
- Do not modify content schemas for v1 motif-evolution work.
- Motifs with fewer than 6 structured events do not render an evolution-line section, so each rendered phase can show 2-4 representative events.
- Representative event links must use `timelineHref({ chapter, motif }, eventId)`, producing links such as `/timeline?chapter=9&motif=rain#chapter-09-02`.

Phase rules:

- Related motif events are sorted by `chapter` and `order`.
- Phase count is deterministic: 3 phases for 6-7 events, 4 for 8-18 events, and 5 for 19+ events.
- Splits use contiguous event order, keep at least 2 events per phase, and snap to nearby chapter breaks when possible.
- Phase titles combine position labels (`初现`, `扩散`, `变形`, `回潮`, `终局`) with the dominant motif-function label.
- Motif functions are controlled labels scored from event `themes` and event `motifs`:
  - `创世奇迹`
  - `记忆回返`
  - `战争阴影`
  - `情欲阻断`
  - `现代性侵入`
  - `衰败预兆`
  - `终局揭示`
  - fallback `叙事共现`
- Each phase shows 1-3 function labels, top associated characters capped at 6, and 2-4 representative events.

Responsive behavior:

- The evolution-line section sits after the top motif archive/relation grid and before “关联事件时间线”.
- Desktop: representative events use a compact two-column grid inside each phase.
- Mobile: phase headers stack, event cards become one column, and the section must not create page-level horizontal overflow.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/motifs/rain`, `/motifs/parchment`, `/motifs/war`, `/motifs/solitude`, and `/motifs/death`
- Browser check that `/motifs/music` and `/motifs/mirror` hide the section cleanly
- Browser check that representative event links open `/timeline?...#event-id`
- Browser check for mobile viewport behavior and no page-level horizontal overflow
- Regression browser check for `/characters/ursula-iguaran`

### Theme Archive

Routes:

- `/themes`
- `/themes/[id]`

Theme archive pages are generated from a code-defined controlled registry, not from a `themes` content collection. v1 themes are:

- `family`
- `memory`
- `war`
- `death`
- `desire`
- `modernity`
- `fate`
- `time`

Theme index pages show:

- 8 theme cards in registry order
- theme summary
- event count
- chapter count
- related public article count
- compact registry tags

Theme detail pages show:

- registry summary and description
- registry `matchThemes` cluster
- relation index for chapters, characters, and motifs
- rule-generated theme evolution line
- related event timeline
- related public articles

Core data builders/helpers:

- `getThemeRegistry` in `src/lib/relations.ts`
- `buildThemeIndex` in `src/lib/relations.ts`
- `buildThemeArchive` in `src/lib/relations.ts`
- `themeHref` in `src/lib/content.ts`

### Theme Evolution Line v1

Route: `/themes/[id]`

Purpose: make each major theme readable as a transformation trajectory across the book. It answers “how this theme is generated, displaced, repeated, and closed” using compact rule-generated phases.

Implementation:

- Registry: `THEME_REGISTRY` in `src/lib/relations.ts`
- Data builder: `buildThemeArchive` in `src/lib/relations.ts`
- Evolution-line helper: private `buildThemeEvolutionLine` in `src/lib/relations.ts`
- Exported types: `ThemeDefinition`, `ThemeIndexItem`, `ThemeArchive`, `ThemeEvolutionLine`, `ThemeEvolutionPhase`, and `ThemeEvolutionEvent`
- UI: `src/components/relations/ThemeEvolutionLine.astro`
- Pages: `src/pages/themes/index.astro` and `src/pages/themes/[id].astro`
- Styles: `.theme-index-*`, `.theme-profile`, `.theme-cluster-*`, and `.theme-evolution-*` blocks in `src/styles/global.css`

Data rules:

- Theme archive data is generated only from structured `events` collection data plus resolved chapters, characters, motifs, and public articles.
- Do not parse Markdown bodies or add AI-generated prose for theme archive data.
- Do not modify content schemas for v1 theme work.
- There is no `themes` content collection in v1.
- Static theme detail paths come only from `getThemeRegistry()`.
- Theme pages use theme clusters, not raw theme id one-to-one matching.
- Theme representative event links must use `timelineHref({ chapter }, eventId)`, producing links such as `/timeline?chapter=3#chapter-03-01`.
- `/timeline` still does not support `?theme=` filtering in v1.

Theme cluster rules:

- `family`: `family`, `genesis`, `origin`, `inheritance`, `legacy`, `marriage`, `identity`
- `memory`: `memory`, `historical-trauma`, `return`, `repetition`, `reading`, `literature`
- `war`: `war`, `state`, `power`, `massacre`, `violence`, `dictatorship`, `execution`, `discipline`, `historical-trauma`
- `death`: `death`, `decay`, `aging`, `mourning`, `emptiness`
- `desire`: `desire`, `love`, `beauty`, `betrayal`, `refusal`, `guilt`, `abandonment`, `marriage`
- `modernity`: `modernity`, `expansion`, `prosperity`, `migration`, `colonialism`, `foreign-order`, `carnival`
- `fate`: `fate`, `ending`, `metafiction`, `return`, `repetition`
- `time`: `time`, `repetition`, `return`, `aging`

Phase rules:

- Related theme events are sorted by `chapter` and `order`.
- Theme evolution lines render only when the theme cluster has at least 6 structured events.
- Phase count is deterministic: 3 phases for 6-7 events, 4 for 8-18 events, and 5 for 19+ events.
- Splits use contiguous event order, keep at least 2 events per phase, and snap to nearby chapter breaks when possible.
- Phase names are `生成`, `扩散`, `转向`, `回返`, and `闭合`.
- Phase function tags are selected from the dominant matched raw theme ids in that phase and converted to controlled Chinese labels.
- Each phase shows 1-3 function labels and 2-4 representative events.

Related article rules:

- Only public articles are shown.
- Article scoring includes direct theme id matches, theme-cluster matches, shared event ids, shared chapters, and a small boost for `theme-essay`.
- Detail pages show up to 8 related articles.

Responsive behavior:

- The theme evolution section sits after the top theme archive/relation grid and before “关联事件时间线”.
- Desktop: representative events use a compact two-column grid inside each phase.
- Mobile: phase headers stack, event cards become one column, and the section must not create page-level horizontal overflow.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/themes`
- Browser check for all 8 `/themes/[id]` detail pages
- Browser check that representative event links open `/timeline?chapter=...#event-id`
- Browser check that `/timeline` still has no theme filter
- Browser check for mobile viewport behavior on `/themes`, `/themes/memory`, and `/themes/fate`
- Regression browser check for `/characters/ursula-iguaran`, `/motifs/rain`, `/timeline`, and `/map`

### Articles

Routes:

- `/articles`
- `/articles/[slug]`

Articles are public analysis pieces. Related reading is scored by shared chapters, events, characters, motifs, themes, intertexts, and article type.

Core helpers:

- `getPublicArticles`
- `getRelatedArticles`
- `getChapterRelatedArticles`

These live in `src/lib/content.ts`.

### Search

Route: `/search`

Search uses a React island:

- `src/components/search/SearchPanel.tsx`

It loads `/pagefind/pagefind.js` at runtime. In dev mode, Pagefind may be unavailable until `npm run build` has generated the index.

### Full Book Event Timeline v1

Route: `/timeline`

Purpose: full-book narrative spine and evidence layer for the 165 structured events.

Implementation:

- Data builder: `buildEventTimeline` in `src/lib/relations.ts`
- URL helper: `timelineHref` in `src/lib/content.ts`
- React island: `src/components/events/EventTimelineExplorer.tsx`
- Page: `src/pages/timeline.astro`
- Styles: event-timeline blocks in `src/styles/global.css`
- Main nav link: `事件` in `src/layouts/BaseLayout.astro`

Data rules:

- Events come only from the `events` content collection.
- The page does not modify content schemas.
- Events are sorted by `chapter` and `order`.
- Event people, motifs, chapters, and related articles are resolved through structured content entries.
- Missing referenced people, motifs, chapters, or articles are filtered out by the builder.

Interaction:

- Default view shows all 165 events grouped by chapter.
- Filters support chapter, character, and motif.
- Query params are `?chapter=1`, `?character=ursula-iguaran`, and `?motif=rain`; filters may be combined.
- Each event has a stable in-page anchor matching its event id, such as `#chapter-01-01`.
- Clicking chapter headings opens the chapter page; clicking person/motif tags opens their archive pages.
- The clear button resets filters and returns the URL to `/timeline`.

Related entry links:

- Character pages link to `/timeline?character={id}`.
- Motif pages link to `/timeline?motif={id}`.
- Chapter pages link to `/timeline?chapter={chapter}`.

Responsive behavior:

- Desktop: filters wrap in a compact toolbar above the chapter-grouped list.
- Mobile: filter controls stack full-width.
- The timeline must not create page-level horizontal overflow.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/timeline`
- Browser check for URL params, select filters, clear filter behavior, and detail-page timeline links
- Browser check for mobile viewport behavior

### Global Relation Map v1

Route: `/map`

Purpose: restrained overview/navigation tool, not a complex knowledge graph product.

Implementation:

- Data builder: `buildRelationMap` in `src/lib/relations.ts`
- React SVG island: `src/components/relations/RelationMap.tsx`
- Page: `src/pages/map.astro`
- Styles: relation-map blocks in `src/styles/global.css`
- Main nav link: `图谱` in `src/layouts/BaseLayout.astro`

Data rules:

- Nodes are only `character`, `motif`, and `chapter`.
- Edges come only from same-event co-occurrence.
- Edge weight is the number of shared events.
- Edge evidence comes from the same structured event set and includes sorted event ids, titles, chapter/order metadata, and `/timeline` hrefs.
- Edge evidence links should use `timelineHref`; do not add ad hoc URL string assembly or parse Markdown bodies.
- The builder outputs `nodes`, `edges`, and `stats`.
- It does not modify content schemas.

Default map scope:

- All 20 chapters are default core nodes.
- Top 12 characters by event participation are default core nodes.
- Top 10 motifs by event participation are default core nodes.
- Default visible edges are the strongest 100 edges among visible nodes.

Interaction:

- Type filters toggle 人物 / 意象 / 章节.
- Hiding a node type also hides related edges.
- Clicking a node navigates to the corresponding character, motif, or chapter page.
- Clicking a visible edge, focusing it with keyboard, or selecting it from the side panel shows the edge evidence panel.
- Edge evidence lists all supporting co-occurrence events and links each title to `/timeline` with a stable event anchor, such as `/timeline?chapter=5#chapter-05-01`.
- When a node is focused, the side panel also shows a compact “共现事件” evidence sample from its strongest related edges.
- `?focus=character:{id}` and `?focus=motif:{id}` highlight the target node and include strong neighbors even when the target is not part of the default core.
- Hover/focus highlights adjacent nodes and edges; active edge selection highlights the edge endpoints.
- The side panel switches between overview, focused node, and focused edge evidence states.

Responsive behavior:

- Desktop: graph and side panel sit side by side.
- Mobile: graph and panel stack vertically.
- SVG remains fixed-format; on narrow screens the graph scrolls inside `.relation-map-stage` without creating page-level horizontal overflow.
- Evidence titles must wrap inside the side panel and must not create page-level horizontal overflow.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/map`
- Browser check for default strongest-edge selection and edge evidence links to `/timeline?...#event-id`
- Browser check for direct edge click/keyboard selection and focused-node “共现事件” samples
- Browser check for type filter toggles
- Browser check for detail-page focus link
- Browser check for mobile viewport behavior

### Relation Explanation v1

Route: `/map`

Purpose: make relation-map edges readable, not only traceable. The edge sidebar now answers “why this relationship matters” before listing the full evidence trail.

Implementation:

- Data builder: `buildRelationMap` in `src/lib/relations.ts`
- Explanation type: `RelationMapEdgeExplanation`
- Edge field: `RelationMapEdge.explanation`
- UI: active edge panel in `src/components/relations/RelationMap.tsx`
- Styles: `.relation-map-explanation`, `.relation-map-function-tags`, and `.relation-map-key-evidence` in `src/styles/global.css`

Data rules:

- Explanations are generated only from structured `events` collection data.
- Do not parse Markdown bodies or add AI-generated prose for this feature.
- Do not modify content schemas for v1 explanation work.
- Explanation evidence links must continue to use the existing edge evidence hrefs generated through `timelineHref`.

Explanation output:

- `relationType`: readable type label such as `人物-意象`, `人物-章节`, `意象-意象`, or `人物-人物`.
- `timeSpan`: rule-based chapter-span text, such as `集中在第15章`, `分布在第5至8章，共4个章节`, or `横跨第1至20章，接近全书跨度`.
- `keyEvidence`: 2-3 representative event links shown before the full event list.
- `literaryFunctions`: 1-3 controlled Chinese function labels derived from event `themes`.

Rule conventions:

- Literary functions use a fixed theme-to-label mapping, currently including:
  - war/state/power/massacre/violence themes → `战争化 / 国家暴力`
  - memory/return/repetition/time/reading/metafiction themes → `记忆回返 / 叙事自证`
  - family/inheritance/marriage/legacy/origin/genesis themes → `家族封闭 / 血缘继承`
  - death/decay/aging/ending/fate/mourning themes → `死亡预兆 / 衰败终局`
  - love/desire/beauty/betrayal/refusal/guilt/abandonment themes → `情欲阻断 / 孤独生成`
  - modernity/expansion/prosperity/migration/colonialism/foreign-order themes → `现代性侵入 / 外部秩序`
- If no theme rule matches, use the fallback label `叙事共现`.
- If an edge has three or fewer evidence events, `keyEvidence` shows all of them.
- If an edge spans several chapters, `keyEvidence` selects first, middle, and last events.
- If an edge is concentrated in a small chapter range, `keyEvidence` uses the first three events in timeline order.

Interaction:

- The default idle `/map` state shows the strongest visible edge and its explanation.
- Clicking a visible edge, focusing an edge with keyboard, or selecting a side-panel strong relation updates the explanation.
- Focused node panels still show node detail first; selecting a relation from that panel switches to the edge explanation panel.
- Type filters may change the default strongest visible edge, and the explanation should update with it.

Responsive behavior:

- Explanation text and key evidence titles must wrap inside the side panel.
- On mobile, the explanation fact grid collapses to one column.
- The feature must not create page-level horizontal overflow; the SVG should continue scrolling only inside `.relation-map-stage`.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for default strongest-edge explanation
- Browser check for SVG edge click and keyboard edge activation
- Browser check for `?focus=character:{id}` node panel followed by side-panel relation selection
- Browser check for type filter changes
- Browser check for key evidence link to `/timeline?...#event-id`
- Browser check for mobile viewport behavior and no page-level horizontal overflow

## Shared Relation Components

The current relation UI is intentionally reused across character, motif, and theme archives:

- `src/components/relations/RelationIndex.astro`
- `src/components/relations/RelationTimeline.astro`
- `src/components/relations/CoOccurrencePanel.astro`
- `src/components/relations/CharacterFateLine.astro`
- `src/components/relations/MotifEvolutionLine.astro`
- `src/components/relations/ThemeEvolutionLine.astro`
- `src/components/relations/RelationMap.tsx`

Prefer extending these patterns before introducing a separate relation UI system.

## Styling Conventions

Global visual language:

- paper background
- green/rust/yellow/rain accent palette
- serif display typography via `--serif`
- restrained card radius via `--radius`
- `surface`, `tag`, `link-card`, `meta-row`, and relation-specific class blocks

When adding UI:

- Use existing classes first.
- Keep cards shallow; avoid cards inside cards.
- Keep relation/map UI readable and navigational.
- Do not introduce a heavy visualization dependency unless interaction requirements become materially more complex.

## Development Notes For Future Agents

- Content references should be validated with `npm run content:check` after relationship or content schema work.
- Run `npm run build` before considering site-wide routing or React island work complete.
- Pagefind warnings about Chinese stemming are expected.
- `public/data/manifest.json` is generated by `scripts/generate-indexes.mjs`; do not hand-edit it unless deliberately changing generated output.
- The project may not always have a usable local `.git` directory in the working environment, so check before relying on git commands.
- Preserve existing Chinese copy and literary tone unless the user explicitly asks for a product-style rewrite.
