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
- entry link to the global relation map with `?focus=theme:{id}`
- entry link to the full-book timeline with `?theme={id}`

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
- Theme representative event links must use `timelineHref({ chapter, theme: theme.id }, eventId)`, producing links such as `/timeline?chapter=3&theme=memory#chapter-03-01`.

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
- Browser check that theme detail entry links open `/timeline?theme={id}`
- Browser check that representative event links open `/timeline?chapter=...&theme=...#event-id`
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

### Article Relation Spine v1

Route: `/articles/[slug]`

Purpose: make each public article a structured navigation node in the archive, not just a standalone essay. A reader can move from an analysis article back to its linked chapters, characters, motifs, themes, and timeline events.

Implementation:

- Data builder: `buildArticleArchive` in `src/lib/relations.ts`
- Exported type: `ArticleArchive`
- UI wrapper: `src/components/article/ArticleRelationSpine.astro`
- Page integration: `src/pages/articles/[slug].astro`
- Styles: `.article-relation-spine`, `.article-spine-theme-timeline`, and `.article-spine-events` blocks in `src/styles/global.css`

Data rules:

- The spine uses only article frontmatter: `chapters`, `characters`, `motifs`, `themes`, and `events`.
- Do not parse Markdown bodies, do not infer relations from event `relatedArticles`, and do not add AI-generated summaries or automatic tags.
- Do not modify content schemas for v1 article-spine work.
- Chapter, character, motif, and event references are resolved through structured Astro content entries.
- Article theme frontmatter may include raw theme labels; linked theme archive entries must be resolved through `THEME_REGISTRY` clusters.
- A theme is linked when the raw article theme equals a registry id or appears in that registry entry's `matchThemes`.
- Raw article theme labels that do not resolve to a registry entry are omitted from the linked index to avoid `/themes/{raw}` 404s.

UI behavior:

- The section title is `本文档案索引`.
- `RelationIndex.astro` is reused for `关联章节`, `关联人物`, `关联意象`, and `关联主题`.
- Resolved theme archive links open `/themes/{id}`.
- Resolved theme timeline links open `/timeline?theme={id}`.
- If the article has explicit frontmatter events, a light `关联事件` timeline renders via `RelationTimeline.astro`.
- Article event links must use `timelineHref({ chapter: event.data.chapter }, event.data.id)`, producing links such as `/timeline?chapter=15#chapter-15-01`.
- If no index sections and no explicit events exist, the spine renders nothing.
- The spine sits after the article header and before the Markdown body; `继续阅读` remains after the article body.

Responsive behavior:

- Desktop: relation index sections can use a compact two-column grid inside the article content column.
- Mobile: relation index sections collapse to one column and must not create page-level horizontal overflow.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/articles/chapter-15-deep-reading`
- Browser check for `/articles/ursula-century-guardian`
- Browser check for `/articles/ice-memory-latin-america`
- Browser check that event links open `/timeline?chapter=...#event-id`
- Browser check that theme archive links open `/themes/{id}`
- Browser check that theme timeline links open `/timeline?theme={id}`
- Browser check for mobile viewport behavior and no page-level horizontal overflow

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
- Theme filter options come from `THEME_REGISTRY`, not from a `themes` collection.
- Theme filtering uses each registry entry's `matchThemes` cluster against event `themes`, not raw theme id exact matching.

Interaction:

- Default view shows all 165 events grouped by chapter.
- Filters support chapter, character, motif, and theme.
- Query params are `?chapter=1`, `?character=ursula-iguaran`, `?motif=rain`, and `?theme=memory`; filters may be combined.
- Each event has a stable in-page anchor matching its event id, such as `#chapter-01-01`.
- Clicking chapter headings opens the chapter page; clicking person/motif tags opens their archive pages.
- The clear button resets filters and returns the URL to `/timeline`.

Related entry links:

- Character pages link to `/timeline?character={id}`.
- Motif pages link to `/timeline?motif={id}`.
- Chapter pages link to `/timeline?chapter={chapter}`.
- Theme pages link to `/timeline?theme={id}`.

### Timeline Theme Filter v1

Route: `/timeline`

Purpose: connect theme archive pages back to the full-book event spine. A reader can move from `/themes/memory` to `/timeline?theme=memory` and see the complete distribution of that theme cluster across structured events.

Implementation:

- URL helper: `timelineHref` accepts `theme?: string | null` in `TimelineHrefFilters`.
- Data builder: `buildEventTimeline` returns `filters.themes` and `stats.themes`.
- Filter option type: `EventTimelineFilterOption` may carry `matchThemes` for theme-cluster matching.
- Relation link type: `RelationKind` includes `theme`.
- UI: `src/components/events/EventTimelineExplorer.tsx` renders a “主题” select in the existing timeline toolbar.

Data and URL rules:

- Theme URL values are registry ids such as `memory`, `fate`, or `modernity`.
- All theme filter options are generated from `THEME_REGISTRY` in registry order and include event counts.
- Invalid `?theme=` values are ignored and cleaned from the URL after the React island hydrates.
- Combined filters use AND semantics, so `/timeline?chapter=13&theme=memory` shows only chapter 13 events that match the `memory` theme cluster.
- Theme nodes are now handled by `/map` theme-node v1; timeline theme filtering remains independent and keeps using theme clusters.

Related links:

- Theme detail pages link to `/map?focus=theme:{id}`.
- Theme detail pages link to `/timeline?theme={id}`.
- Theme evolution representative events link to `/timeline?chapter={chapter}&theme={id}#event-id`.
- Character, motif, chapter, and relation-map timeline links keep their existing filter behavior.

Responsive behavior:

- Desktop: filters wrap in a compact toolbar above the chapter-grouped list.
- Mobile: filter controls stack full-width.
- The timeline must not create page-level horizontal overflow.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/timeline`
- Browser check for `/timeline?theme=memory` and `/timeline?chapter=13&theme=memory`
- Browser check for invalid `?theme=unknown`, select filters, clear filter behavior, and detail-page timeline links
- Browser check for mobile viewport behavior and no page-level horizontal overflow
- Regression browser check that `/map` theme-node behavior still coexists with timeline theme filtering

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

- Nodes are `character`, `motif`, `chapter`, and `theme`.
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
- All 8 themes from `THEME_REGISTRY` are default core nodes.
- Default visible edges are the strongest 100 edges among visible nodes.

Interaction:

- Type filters toggle 人物 / 意象 / 章节 / 主题.
- Hiding a node type also hides related edges.
- Clicking a node navigates to the corresponding character, motif, chapter, or theme page.
- Clicking a visible edge, focusing it with keyboard, or selecting it from the side panel shows the edge evidence panel.
- Edge evidence lists all supporting co-occurrence events and links each title to `/timeline` with a stable event anchor, such as `/timeline?chapter=5#chapter-05-01`.
- When a node is focused, the side panel also shows a compact “共现事件” evidence sample from its strongest related edges.
- `?focus=character:{id}`, `?focus=motif:{id}`, and `?focus=theme:{id}` highlight the target node and include strong neighbors even when the target is not part of the default core.
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

### Relation Map Theme Nodes v1

Route: `/map`

Purpose: close the archive navigation loop by making themes a first-class relation-map dimension. Readers can move from “记忆 / 战争 / 命运” to the people, motifs, and chapters that co-occur with that theme cluster.

Implementation:

- Node kind: `RelationMapNodeKind` includes `theme`.
- Theme source: `THEME_REGISTRY` in `src/lib/relations.ts`.
- Data builder: `buildRelationMap` in `src/lib/relations.ts`.
- UI: `src/components/relations/RelationMap.tsx` renders the “主题” toggle and top theme lane.
- Page entry: `src/pages/themes/[id].astro` links to `/map?focus=theme:{id}`.
- Styles: `.relation-map-node-theme` blocks in `src/styles/global.css`.

Data and edge rules:

- Theme nodes are generated only from `THEME_REGISTRY`; there is still no `themes` content collection.
- Theme event matching uses each registry entry's `matchThemes` cluster against event `themes`, not raw theme id exact matching.
- All 8 theme nodes are `core: true` and visible by default.
- Events generate theme edges to characters, motifs, and chapters through same-event co-occurrence.
- v1 deliberately excludes `theme-theme` edges so abstract theme co-occurrence does not dominate the strongest-edge list.
- Theme edge evidence links must use `timelineHref(relationMapTimelineFilters(...), eventId)`.
- Theme edge timeline filters include `chapter` and `theme`; if the other endpoint is a character or motif, the link also keeps `character` or `motif`, producing URLs such as `/timeline?chapter=3&motif=memory&theme=memory#chapter-03-01`.
- Do not parse Markdown bodies, do not add AI-generated relation prose, and do not modify content schemas for this feature.

Interaction:

- `/map` shows the “主题” type toggle on by default.
- Turning off “主题” hides theme nodes and all theme edges.
- `/map?focus=theme:memory` and other registry ids focus the corresponding theme node and show strong relations in the side panel.
- Selecting a strong relation from a focused theme panel switches to the existing edge explanation/evidence panel.
- Theme detail pages expose the graph entry before the timeline entry.

Responsive behavior:

- Desktop: theme nodes sit in a compact top lane above the chapter axis.
- Mobile: the fixed-format SVG continues to scroll only inside `.relation-map-stage`; the page itself must not create horizontal overflow.
- Theme labels must not overlap neighboring node labels.

Verified after implementation:

- `npm run content:check`
- `npm run build`
- Browser check for `/map` with 4 toggles and 8 visible theme nodes by default
- Browser check for theme toggle off/on behavior
- Browser check for `/map?focus=theme:memory` and `/map?focus=theme:war`
- Browser check that theme edge evidence opens `/timeline?chapter=...&theme=...#event-id`
- Browser check that `/themes/memory` and `/themes/fate` graph-entry links focus the theme node
- Browser check for mobile viewport behavior, no page-level horizontal overflow, and theme-label overlap

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
- `src/components/article/ArticleRelationSpine.astro`

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

## Deployment Workflow

Production is deployed through GitHub + Netlify. Supabase credentials are configured only as Netlify/local environment variables when backend features need them.

### GitHub

- Canonical repository: `git@github.com:kevinandliao2018-gmail/macondo-atlas.git`
- Current pushed branch: `main`
- If local SSH auth points to the wrong GitHub account, use the HTTPS remote instead:
  `https://github.com/kevinandliao2018-gmail/macondo-atlas.git`
- Recommended GitHub CLI repair flow when HTTPS auth is needed:
  - `gh auth login`
  - choose `github.com`
  - choose `HTTPS` for Git operations
  - run `gh auth setup-git`
  - confirm `git remote -v`
- Before pushing, run `git status -sb` and ensure private folders, `.env`, `dist/`, and `node_modules/` are not staged.

### Netlify

- Netlify project: `macondo-atlas`
- Netlify project URL: `https://app.netlify.com/projects/macondo-atlas`
- Production site URL: `https://macondo-atlas.netlify.app`
- Build settings are committed in `netlify.toml`:
  - build command: `npm run build`
  - publish directory: `dist`
- `astro.config.mjs` reads `process.env.PUBLIC_SITE_URL` and falls back to `https://macondo-atlas.netlify.app`.
- A push to `main` should trigger a Netlify production deploy when the project is connected to the GitHub repo.
- If Netlify says “No config file was defined,” confirm `netlify.toml` has been pushed and the deploy is using the latest `main`.

### Supabase And Environment Variables

- Do not commit `.env` or any secret value.
- Netlify environment variables may include these names when the project needs Supabase/server features:
  - `PUBLIC_SITE_URL`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATABASE_URL`
  - `BLOG_ADMIN_TOKEN`
- Only `PUBLIC_SITE_URL` is safe to expose client-side. Treat `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `BLOG_ADMIN_TOKEN` as server-only secrets.
- If a database password, service role key, or admin token is exposed in chat/logs/docs, rotate it in Supabase/Netlify before relying on production.
- This static Astro surface currently builds without Supabase access; missing Supabase variables should not block `npm run build` unless future backend code explicitly requires them.

### Private Source Boundary

- Raw/private source folders stay local-only and are ignored by Git, including `/原文/` and the other research-material directories listed in `.gitignore`.
- `scripts/check-content.mjs` must keep public content validation strict while allowing `/原文/` to be absent on CI/Netlify.
- The check should still fail if a public route such as `src/pages/original` is introduced for private source material.

### Standard Deploy Steps

1. Run `npm run content:check`.
2. Run `npm run build`.
3. Optionally simulate Netlify/private-source absence with `CI=true npm run content:check` in a temporary copy that excludes `/原文/`.
4. Confirm `git status --short` contains only intended source/config changes.
5. Commit with a concise message and push `main`.
6. Check Netlify deploy logs for successful Astro build and Pagefind generation.
7. Verify production with `curl -I https://macondo-atlas.netlify.app` or a browser smoke test.

Common Netlify failure to remember:

- `Expected private source directory 原文/ to remain in place` means the content check has become CI-hostile again. Keep private source material untracked and fix the checker, not the deploy by pushing private raw text.

## Development Notes For Future Agents

- Content references should be validated with `npm run content:check` after relationship or content schema work.
- Run `npm run build` before considering site-wide routing or React island work complete.
- Pagefind warnings about Chinese stemming are expected.
- `public/data/manifest.json` is generated by `scripts/generate-indexes.mjs`; do not hand-edit it unless deliberately changing generated output.
- The project may not always have a usable local `.git` directory in the working environment, so check before relying on git commands.
- Preserve existing Chinese copy and literary tone unless the user explicitly asks for a product-style rewrite.
