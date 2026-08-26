# RepliGraph — UI/UX Specification

## 1. Design thesis

**Archetype:** scientific notebook and instrument panel with graph-paper logic

**Signature:** The relation view is a three-row scientific comparison table: Question / Method / Conclusion, with vector neighbors as specimen tabs. Graph edges use different stroke patterns rather than rainbow colors.

The interface must visually belong to this domain. Remove the logo and a reviewer should still identify what kind of product it is.

## 2. Anti-generic-AI rules

Do not use:

- purple/blue gradient hero;
- glowing background orbs;
- centered “AI-powered” headline + 3 feature cards;
- glassmorphism;
- bento-grid filler;
- giant rounded rectangles everywhere;
- decorative metric cards without a workflow purpose;
- meaningless radar/donut charts;
- excessive icons;
- sparkle/brain/robot AI motifs;
- 3D tokens/network spheres;
- wallet-connect as primary visual identity;
- hover lift/drop-shadow on every surface.

Do not import a UI kit and accept its default look. If primitives are used, restyle them to this system.

## 3. Color system

| Token | Hex | Primary use |
| --- | --- | --- |
| paper | `#FAFAF6` | scientific paper surface |
| blue | `#1D5AA5` | accepted/related research edge |
| oxide | `#B44F36` | contradictory-result emphasis |
| graphite | `#303438` | primary text/axes |
| grid | `#D8DDE1` | graph-paper guides |

Use status text alongside color. Do not create gradients between these colors.

## 4. Typography

STIX Two Text for scientific titles/abstract-like text; IBM Plex Sans for UI; IBM Plex Mono for identifiers

### Type roles

- **Domain title:** strong display face defined above.
- **Primary prose/evidence:** readable text face with generous line height.
- **Identifiers/digests:** mono where specified.
- **Controls:** compact UI face.
- **Status:** uppercase or small-cap only when it matches this project's design language; never use every label as a pill.

## 5. Geometry and surfaces

graph paper backgrounds only in analysis areas, crisp square panels, 3px radius, thin axis lines

Borders/rules should do more work than shadows. Keep domain documents, maps, timelines, brackets or matrices visually primary.

## 6. Motion

graph node focus and edge tracing only; no physics-bounce default

All motion obeys `prefers-reduced-motion`.

## 7. Application chrome

### Header

- Project/domain context left.
- Live StudioNet/fixture/unavailable provenance visible but quiet.
- Actual wallet network + address utility right.
- No auto-connect.
- Wrong network blocks the write in-context.

### Navigation

Navigation should use the domain concepts from the route list below. Avoid generic “Dashboard / Analytics / Settings” unless a screen genuinely is settings.

## 8. Route-by-route specification

### `/` — Research graph canvas

**Desktop composition:** Graph occupies 70%; study list/filter ledger left; relation legend bottom.

**Primary action:** Select/register study

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/studies/new` — Study registration sheet

**Desktop composition:** Scientific form with Question/Method/Conclusion as separate ruled sections and manifest checksum panel.

**Primary action:** Register study

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/studies/[id]` — Study dossier

**Desktop composition:** Paper-like abstract header, three semantic fields, provenance and relation edges.

**Primary action:** Claim relation

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/relations/new` — Relation comparison

**Desktop composition:** Source vs target, three-row Question/Method/Conclusion matrix and claimed relation.

**Primary action:** Submit relation

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/relations/[id]` — Method matrix

**Desktop composition:** Independent evidence comparison with semantic neighbors in specimen tabs.

**Primary action:** Run adjudication

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/neighbors/[id]` — Semantic neighbor drawer

**Desktop composition:** Field-specific nearest studies as list with raw distances and versions.

**Primary action:** Open candidate

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/receipts/[id]` — Edge receipt

**Desktop composition:** Relation edge, version pins, tx and rationale.

**Primary action:** Copy/explorer

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.


## 9. Signature components

The component library should be named around the domain. Core cross-project primitives may exist internally, but visible components should reflect this product.

- **Primary domain surface:** implement the `scientific notebook and instrument panel with graph-paper logic` rather than a card grid.
- **Decision strip/rail:** fixed place for on-chain status and tx lifecycle.
- **Semantic context:** related records with ID/version/raw distance.
- **Immutable reference block:** URL + digest + copy + provenance.
- **History/version object:** append-only past decisions.
- **Network gate:** exact expected/actual chain.
- **Receipt:** printable/copyable authoritative outcome.

Project pages to support:

- Research graph canvas
- Study registration sheet
- Study dossier
- Relation comparison
- Method matrix
- Semantic neighbor drawer
- Edge receipt
- Graph filters

## 10. Transaction experience

Never show “success” after only receiving a transaction hash.

```text
Awaiting signature
  -> submitted (hash)
  -> consensus/finality pending
  -> FINALIZED
  -> inspect GenVM execution
     -> SUCCESS: re-read record
     -> ROLLBACK/ERROR: show failure, do not fake state
```

Do not show a fake percentage while consensus is pending.

## 11. Semantic-memory presentation

Semantic memory is related context, not truth.

### Show

- record title/ID;
- namespace/version;
- raw vector distance;
- one bounded authoritative excerpt/summary;
- final status of that prior record;
- why it is eligible.

### Never show

- “92% true”;
- “AI confidence based on similarity”;
- “validator certainty” derived from KNN;
- a green check merely because distance is small.

## 12. Density and information design

This product should be usefully dense.

- Repeated records use ruled lists/tables.
- Identifiers are selectable/copyable.
- Evidence and result are visually distinguishable.
- Digests/versions sit beside the object they bind.
- Do not hide critical details behind hover.
- Avoid excessive whitespace that turns an operational app into a landing page.

## 13. Responsive system

### Desktop

Use the full signature composition.

### Tablet

Primary domain object + one context pane; other nav/context becomes a drawer.

### Mobile

- one main column;
- 44px touch targets;
- dedicated full-screen mode for map/graph/bracket/complex matrix;
- hashes wrap and have copy controls;
- evidence/context becomes a sheet;
- primary write can use a bottom action bar only when contextually valid.

## 14. Accessibility

- WCAG AA text contrast.
- Text labels for all status colors.
- Full keyboard access.
- Visible focus state.
- Table headers/semantic HTML.
- List alternative to visual graph/map.
- Evidence selectable as text.
- Reduced motion.
- Minimum practical text size 12px for dense metadata, larger for critical text.

## 15. Content language

Use domain language and precise transaction language.

Good:

- “Related records retrieved”
- “Bound to version 3”
- “Finalized; GenVM execution rolled back”
- “Insufficient public evidence”
- “No eligible semantic memory found”

Avoid:

- “AI magic”
- “Trustless revolution”
- “Intelligence score”
- “Smart insights”
- “Powered by next-gen AI”

## 16. Screenshot quality bar

- [ ] Logo can be removed and the product is still visually identifiable.
- [ ] No generic AI-template motifs.
- [ ] Main domain artifact occupies more attention than metrics.
- [ ] Wallet is utility chrome.
- [ ] Provenance is visible.
- [ ] Transaction truth is inspectable.
- [ ] VecDB distance is not mislabeled.
- [ ] Empty/error/abstain states look intentional.
- [ ] Mobile primary workflow is viable.
- [ ] Color, type, geometry and composition differ materially from the other nine packs.
