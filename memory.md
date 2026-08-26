# RepliGraph — Project Memory

> This is a **repository-local project memory file**, not model/session memory. Agents should read it from disk. Keep it concise enough to scan, but update it whenever a durable decision changes.

## Project identity

**Name:** RepliGraph  
**Tagline:** A semantic replication graph for public scientific experiments.  
**Core thesis:** RepliGraph does not decide whether science is true. It settles a narrower but valuable question: how does a new public experiment relate to prior experiments? Researchers register immutable protocols/results and claim a relation to earlier work. VecDB retrieves method-, question- and conclusion-near studies. GenLayer validators classify the relationship into direct replication, material variant, extension, contradictory result or incomparable. The output forms a public provenance graph.

### What the system ultimately settles

an immutable relation edge between two public study/protocol nodes

### Core actors

- researcher
- lab lead
- reviewer
- reader
- GenLayer validator
- data/research graph consumer

## Current status

**Phase:** Initial implementation / verification pending  
**Code status:** Contract and frontend scaffold implemented; toolchain verification pending  
**StudioNet contract:** Not deployed yet  
**Live frontend:** Not deployed yet  
**Last durable update:** 2026-08-26

**Latest verified status:** Contract `0x634a6B4eA931fE258cb81ef471280F14c0ea24A3` is deployed on StudioNet. Two studies are readable, `search_related` returns the related study, claim `1` is `EDGE_ACCEPTED`, and the adjudication transaction finalized successfully. Frontend production URL is `https://repligraph.vercel.app`.

The first implementing agent must not invent fake deployment addresses, transaction hashes, test counts or live URLs. Add them here only after they exist and have been verified.

## Non-negotiable product boundary

### Off-chain

Raw datasets, compute, notebooks and full papers remain in repositories/archives. The contract consumes bounded public manifests and immutable hashes/URLs.

### On-chain

Study nodes; protocol/result digests; semantic vectors; claimed relation cases; accepted relation edges; versioned corrections; consensus receipts.

### Semantic memory

Maintain separate semantic memories for research question, method and conclusion. Each Study inserts three vectors pointing to the same study_id with a field_kind. New relation claims retrieve candidates in each field and present a small evidence matrix. Similarity only proposes related work; it does not establish replication.

### Consensus question

Given source study and candidate study manifests, do the methods and research question match closely enough for DIRECT_REPLICATION, or is the new work a MATERIAL_VARIANT/EXTENSION? If result direction materially differs, classify CONTRADICTORY_RESULT only when comparability is established. Otherwise INCOMPARABLE or INSUFFICIENT.

## Frozen engineering defaults

- StudioNet chain ID: `61999`
- RPC: `https://studio.genlayer.com/api`
- Explorer: `https://explorer-studio.genlayer.com`
- `genlayer-js`: `1.1.8`
- Next.js: `16.3.2`
- React: `19.2.4`
- React DOM: `19.2.4`
- TypeScript: `^5`
- Tailwind: `^4`
- Writes: injected EIP-1193 wallet only
- Backend signer: forbidden
- Vector model baseline: `all-MiniLM-L6-v2` / 384 dimensions
- Similarity semantics: retrieval only
- Live data: no silent fixture fallback
- Finality: wait for FINALIZED, then inspect GenVM execution before success

## Contract invariants

- A relation edge always points to two existing immutable study versions.
- CONTRADICTORY_RESULT requires comparability; otherwise INCOMPARABLE.
- Semantic similarity alone cannot create an edge.
- Corrections increment study version and do not rewrite historical edge evidence.
- One claim produces at most one accepted edge.
- Public manifest digest is bound at registration.

## Scope lock

### MVP

Public text manifests, three vector fields per study, manual source/target relation claims, five relation classes, live consensus, graph explorer and DOI/GitHub metadata helper.

### Explicit non-goals

- declaring scientific truth
- peer-review replacement
- private patient data
- storing raw datasets on-chain
- citation-count reputation

## Known edge cases to preserve during implementation

- Same research question but materially different population/method: MATERIAL_VARIANT, not direct replication.
- Same method but different question: EXTENSION or INCOMPARABLE.
- Opposite conclusion from incomparable data: must not be called contradiction.
- Paper metadata changes after DOI publication; core manifest digest remains immutable.
- Target study is later corrected; old edges remain version-bound and a new relation claim may be opened.

## UI identity

- Archetype: **scientific notebook and instrument panel with graph-paper logic**
- Signature: The relation view is a three-row scientific comparison table: Question / Method / Conclusion, with vector neighbors as specimen tabs. Graph edges use different stroke patterns rather than rainbow colors.
- Fonts: STIX Two Text for scientific titles/abstract-like text; IBM Plex Sans for UI; IBM Plex Mono for identifiers
- Geometry: graph paper backgrounds only in analysis areas, crisp square panels, 3px radius, thin axis lines
- Motion: graph node focus and edge tracing only; no physics-bounce default

Do not let implementation drift into a generic centered hero + three cards + gradient dashboard. `ui/ux.md` is authoritative.

## Decision log

| Date | Decision | Reason | Supersedes |
|---|---|---|---|
| 2026-08-23 | Keep high-volume activity off-chain and settle bounded authoritative state on GenLayer. | Mirrors the project's central off-chain-work/on-chain-settlement thesis and keeps consensus purposeful. | — |
| 2026-08-23 | Use contract-owned VecDB as semantic recall, never as an automatic verdict. | Similarity is relatedness, not truth. | — |
| 2026-08-23 | Injected wallet is the only write identity. | Matches existing hardened repository behavior and avoids hidden custody. | — |
| 2026-08-23 | Fail closed on missing public evidence or malformed consensus output. | A weak answer must not silently become authoritative state. | — |
| 2026-08-23 | UI follows the project-specific design language in `ui/ux.md`. | The ten projects must be visually and structurally distinct. | — |

## Source conventions inherited from existing repositories

The implementation plan intentionally follows proven patterns from these owner repositories:

- `ometere123/intent-guard/package.json` — `genlayer-js` 1.1.8, Next.js 16.3.2, React 19.2.4.
- `ometere123/intent-guard/src/components/wallet-provider.tsx` — explicit injected wallet flow, network gating and wallet event handling.
- `ometere123/intent-guard/src/lib/genlayer/contract.ts` — wait for FINALIZED, re-read transaction and inspect GenVM execution.
- `ometere123/scopelock/contracts/scopelock.py` — native `genlayer_embeddings.VecDB`, 384-dimensional `all-MiniLM-L6-v2`, bounded KNN precedent retrieval.
- Owner research, *GenLayer VectorDB + Vector Embeddings* (Aug 2026) — embeddings provide semantic representation, VecDB persistent semantic memory/search, consensus judges meaning; embeddings are not truth or encryption.

## Open decisions

These are allowed to be decided during implementation, but must be recorded here when settled:

- Exact deployed contract address and deployment source commit.
- Exact public hosting URL.
- Final object-store/database provider if the selected default in `architecture.md` proves unsuitable.
- Whether a second network besides StudioNet is supported after the StudioNet proof is complete.
- Performance limits discovered for the project's actual VecDB population and KNN size.

## Agent continuity rule

At the end of every work session:

1. Ensure `handoff.md` has the most recent factual state.
2. Update this file only for durable decisions/status changes.
3. Do not paste long implementation logs here; keep those in `handoff.md`.
4. Never record secrets, private keys, seed phrases or private source material.
## 2026-08-26 verification update

- npm dependencies repaired; `npm run typecheck`, `npm run lint`, and `npm run build` pass in `apps/web`.
- Official GenLayer CLI `genlayer@0.39.2` installed under `tools/genlayer-cli`; keytar rebuilt and unlocked StudioNet account `faultline-dev` used.
- Latest corrected deployment: `0x7cd6075d0989F2b8640beeD28128BBBC828F3cE6`, tx `0x5e2851568ef1a13c178e925e6c395b2388d3b34b941a82b9dcff4d739914393e`.
- Live `register_study` succeeded: tx `0x6cf1d79c87c64ca520c401ed0d748a19f20b69b9aa347063880bbbeeb829a720`; `get_study(1)` returned the persisted record.
