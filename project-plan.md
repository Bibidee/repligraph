# RepliGraph — Project Plan

## Mission

Build **RepliGraph** into a complete contract + frontend product, using the specifications in this folder as the source of truth.

RepliGraph does not decide whether science is true. It settles a narrower but valuable question: how does a new public experiment relate to prior experiments? Researchers register immutable protocols/results and claim a relation to earlier work. VecDB retrieves method-, question- and conclusion-near studies. GenLayer validators classify the relationship into direct replication, material variant, extension, contradictory result or incomparable. The output forms a public provenance graph.

## MVP target

Public text manifests, three vector fields per study, manual source/target relation claims, five relation classes, live consensus, graph explorer and DOI/GitHub metadata helper.

## Planning principles

1. Do not build the UI first and retrofit a weak contract.
2. Do not build consensus before deterministic state/version/size guards.
3. Do not store high-frequency work on-chain simply because it is easy to model.
4. Do not turn VecDB into a classifier. It is context retrieval.
5. Do not call a deployment “done” until a real StudioNet lifecycle is exercised.
6. Do not create fake fallback data in live mode.
7. Every meaningful work unit updates `handoff.md` immediately.
8. When a durable decision changes, update `memory.md` in the same work unit.

## Reference demo the implementation must support

Register five synthetic/public studies with overlapping questions, claim a direct replication and a contradictory-result relation, show three-field semantic neighbors, adjudicate edges, then explore the resulting graph.

## Phase 0 — Repository and truth scaffold

- Create the recommended repository tree.
- Copy these blueprint docs verbatim first; do not rewrite them from memory.
- Add package manifests with pinned baseline versions.
- Add `.env.example` with StudioNet variables and no secrets.
- Create a placeholder README that explicitly says not deployed yet.
- Initialize `handoff.md` workflow and commit.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 1 — Deterministic contract skeleton

- Add dependency header and imports.
- Implement storage dataclasses, enums and counters.
- Implement create/register deterministic methods and view methods.
- Implement all size, role, namespace and version guards.
- Write direct tests for creation, invalid inputs, ownership, pagination and forbidden transitions.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 2 — Semantic memory

- Add the project-specific `VectorPointer`.
- Implement normalized embedding text exactly around: Maintain separate semantic memories for research question, method and conclusion. Each Study inserts three vectors pointing to the same study_id with a field_kind. New relation claims retrieve candidates in each field and present a small evidence matrix. Similarity only proposes related work; it does not establish replication.
- Insert only invariant-approved records.
- Implement bounded KNN + namespace/version filters.
- Expose a preview view for testing/audit.
- Add tests proving a semantically related but out-of-namespace record cannot authorize anything.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 3 — Consensus path

- Define strict decision envelope and allowed enums.
- Implement leader logic for: Given source study and candidate study manifests, do the methods and research question match closely enough for DIRECT_REPLICATION, or is the new work a MATERIAL_VARIANT/EXTENSION? If result direction materially differs, classify CONTRADICTORY_RESULT only when comparability is established. Otherwise INCOMPARABLE or INSUFFICIENT.
- Implement independent validator reasoning rather than format-only validation.
- Treat fetched evidence as hostile/untrusted data.
- Add deterministic post-consensus validation.
- Add explicit abstain/failure path.
- Forge incorrect leader outputs in tests and prove rejection.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 4 — Off-chain work plane

- Frontend-first architecture. Next.js server routes may proxy public metadata lookups (Crossref/DOI/OSF/GitHub) for CORS and caching, but there is no app database in MVP and no signer. Chain is the graph of record.
- Implement wallet challenge/verify if off-chain roles require identity.
- Implement immutable/public artifact bundle generation and digesting.
- Never add a server signer.
- Add upload/data bounds and content-type validation.
- Document retention/publicity policy.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 5 — GenLayer web client

- Implement config/client/read-client modules.
- Implement injected-wallet provider and network gate.
- Implement typed contract reads and schema verification.
- Implement write helper and FINALIZED + GenVM execution check.
- Implement one live/fixtures boundary; production live mode never silently falls back.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 6 — Distinct frontend

- Implement the visual archetype: scientific notebook and instrument panel with graph-paper logic.
- Build routes around domain records, not generic cards.
- Build the semantic-memory context view.
- Build the transaction rail and authoritative receipt.
- Implement responsive/mobile behavior.
- Implement all empty/error/abstain states from `ui/ux.md`.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 7 — Integration and adversarial testing

- Wire backend artifact bundle to contract submission.
- Verify every frontend-required contract method against schema.
- Run deterministic/direct suites.
- Run wallet-session regressions.
- Test malformed RPC/contract data.
- Test missing evidence, stale version and forged consensus output.
- Run production build/typecheck/lint.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 8 — StudioNet proof

- Deploy a frozen source commit to StudioNet.
- Record address and deployment tx.
- Verify deployed source/schema.
- Execute the reference demo with real transactions.
- Capture at least one live consensus success.
- Capture at least one fail-closed/abstain path where feasible.
- Re-read all final state from chain.
- Update handoff/memory with exact facts only.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 9 — Release hardening

- Deploy hosted frontend in live mode.
- Exercise one write from hosted UI.
- Audit all copy for fabricated/unproven claims.
- Confirm no generated/local private-key path exists.
- Confirm backend has no signer secret.
- Run accessibility/responsive pass.
- Freeze release tag/commit and create reviewer-oriented deployment evidence.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.


## Workstreams and ownership

| Workstream | Primary outputs | Release blocker? |
|---|---|---|
| Intelligent Contract | State machine, VecDB, consensus, views | Yes |
| Direct/testing | Invariants, forged leader rejection, ABI/schema | Yes |
| Off-chain plane | High-volume workflow + immutable bundles | Yes where architecture uses service |
| Web3 client | Injected wallet, reads/writes/finality | Yes |
| UI/UX | Domain-specific routes and states | Yes |
| StudioNet proof | Deployment + live transaction evidence | Yes |
| Documentation | Handoff, memory, deployment truth | Yes |

## Contract milestone checklist

- Implement and test `register_study(title, question_text, method_text, conclusion_text, manifest_url, manifest_digest, publication_ref) -> study_id`.
- Implement and test `update_study_metadata(study_id, correction_url, correction_digest) -> version`.
- Implement and test `claim_relation(source_study_id, target_study_id, claimed_relation, evidence_url, evidence_digest) -> claim_id`.
- Implement and test `adjudicate_relation(claim_id) -> edge`.
- Implement and test `get_study(study_id)`.
- Implement and test `get_relation(claim_id)`.
- Implement and test `list_edges(study_id, offset, limit)`.
- Implement and test `search_related(study_id, field_kind, k)`.

## Invariant checklist

- Test: A relation edge always points to two existing immutable study versions.
- Test: CONTRADICTORY_RESULT requires comparability; otherwise INCOMPARABLE.
- Test: Semantic similarity alone cannot create an edge.
- Test: Corrections increment study version and do not rewrite historical edge evidence.
- Test: One claim produces at most one accepted edge.
- Test: Public manifest digest is bound at registration.

## UX milestone checklist

- Build and verify: Research graph canvas.
- Build and verify: Study registration sheet.
- Build and verify: Study dossier.
- Build and verify: Relation comparison.
- Build and verify: Method matrix.
- Build and verify: Semantic neighbor drawer.
- Build and verify: Edge receipt.
- Build and verify: Graph filters.

## Risk register

| Risk | Early signal | Mitigation |
|---|---|---|
| Consensus prompts too large | timeouts/rotation spikes | lower KNN/evidence bounds; split cases |
| VecDB namespace contamination | irrelevant candidates | deterministic namespace/version filters |
| Backend becomes de facto authority | UI trusts DB status | chain re-read is authoritative after every final action |
| Wrong-chain wallet writes | user wallet not 61999 | write gate in UI and client helper |
| Finalized rollback shown as success | receipt-only logic | inspect GenVM execution |
| UI drifts generic | component-kit/default template | enforce `ui/ux.md` screenshot review |
| Public evidence disappears | validator fetch failures | immutable/content-addressed refs + abstain |
| Runtime API differs from plan | compile/lint/integration failure | verify current SDK, log exact change, do not invent API |
| Overclaim in README | branch only unit-tested | proof table distinguishes direct vs live |

## Project-specific edge-case backlog

- Same research question but materially different population/method: MATERIAL_VARIANT, not direct replication.
- Same method but different question: EXTENSION or INCOMPARABLE.
- Opposite conclusion from incomparable data: must not be called contradiction.
- Paper metadata changes after DOI publication; core manifest digest remains immutable.
- Target study is later corrected; old edges remain version-bound and a new relation claim may be opened.

## Definition of complete

The project is complete only when:

- the MVP flow works end to end;
- the contract is deployed on StudioNet;
- at least one real consensus path is proven;
- the frontend is wired to that contract;
- injected wallet is the only write mechanism;
- contract reads are authoritative;
- direct and frontend checks pass;
- UI is recognizably distinct;
- evidence and VecDB behavior are bounded;
- `memory.md` and `handoff.md` contain the exact final state.
