# RepliGraph — Product Requirements Document (PRD)

## 1. Product summary

**A semantic replication graph for public scientific experiments.**

RepliGraph does not decide whether science is true. It settles a narrower but valuable question: how does a new public experiment relate to prior experiments? Researchers register immutable protocols/results and claim a relation to earlier work. VecDB retrieves method-, question- and conclusion-near studies. GenLayer validators classify the relationship into direct replication, material variant, extension, contradictory result or incomparable. The output forms a public provenance graph.

The product uses a deliberate operating model:

1. high-frequency domain work happens off-chain;
2. a bounded, immutable/public artifact or case is frozen;
3. the Intelligent Contract retrieves only relevant semantic memory;
4. validators judge the semantic question independently;
5. deterministic contract code decides whether/how authoritative state changes.

## 2. Problem

The product must settle:

> **an immutable relation edge between two public study/protocol nodes**

The problem is not that a backend cannot produce an answer. A backend can. The problem is that when multiple parties care about the final result, letting one operator/model author the authoritative state reintroduces the trust assumption GenLayer is meant to remove.

## 3. Why GenLayer is load-bearing

Delete GenLayer and the system loses at least one of:

- independent access to public evidence;
- independent semantic judgment;
- agreement on decision-critical meaning;
- a shared immutable result other contracts can consume.

VecDB alone does not fix this. Similarity only identifies relevant history.

## 4. Goals

- Fast normal workflow off-chain.
- Explicit escalation to shared judgment.
- Project-owned semantic institutional memory.
- Version-bound rules/evidence.
- Deterministic, inspectable state changes.
- Composable final receipts.
- Distinct domain-specific user experience.
- Honest failure/abstain states.
- Real StudioNet deployment proof before release claims.

## 5. Non-goals

- declaring scientific truth
- peer-review replacement
- private patient data
- storing raw datasets on-chain
- citation-count reputation

## 6. Actors

| Actor | Role |
| --- | --- |
| researcher | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| lab lead | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| reviewer | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| reader | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| GenLayer validator | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| data/research graph consumer | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |

## 7. Scope split

### Off-chain

Raw datasets, compute, notebooks and full papers remain in repositories/archives. The contract consumes bounded public manifests and immutable hashes/URLs.

### On-chain

Study nodes; protocol/result digests; semantic vectors; claimed relation cases; accepted relation edges; versioned corrections; consensus receipts.

### Semantic memory

Maintain separate semantic memories for research question, method and conclusion. Each Study inserts three vectors pointing to the same study_id with a field_kind. New relation claims retrieve candidates in each field and present a small evidence matrix. Similarity only proposes related work; it does not establish replication.

### Consensus question

Given source study and candidate study manifests, do the methods and research question match closely enough for DIRECT_REPLICATION, or is the new work a MATERIAL_VARIANT/EXTENSION? If result direction materially differs, classify CONTRADICTORY_RESULT only when comparability is established. Otherwise INCOMPARABLE or INSUFFICIENT.

## 8. MVP

Public text manifests, three vector fields per study, manual source/target relation claims, five relation classes, live consensus, graph explorer and DOI/GitHub metadata helper.

The MVP is not considered complete until a hosted frontend performs the critical path against a real StudioNet deployment.

## 9. User stories

- As a **researcher**, I can configure the authoritative rules/charter and see exactly which version every case uses.
- As a **lab lead**, I can perform normal work off-chain and escalate only the bounded cases that need shared judgment.
- As a **reviewer**, I can inspect the public evidence and related semantic history without treating similarity as truth.
- As a **reader**, I receive bounded, versioned inputs and can reject a semantically wrong leader decision.
- As an external integrator, I can read a typed final receipt without trusting the backend or scraping rationale prose.

## 10. Lifecycle

Product statuses:

- REGISTERED
- RELATION_CLAIMED
- UNDER_REVIEW
- EDGE_ACCEPTED
- EDGE_REJECTED
- INSUFFICIENT

Generic lifecycle:

```text
normal off-chain work
 -> freeze bounded public artifact/case
 -> on-chain submit
 -> deterministic preflight
 -> bounded semantic retrieval
 -> consensus
 -> deterministic validation/state transition
 -> finalized receipt
 -> frontend authoritative re-read
```

## 11. Product surfaces

| Route | Product surface | Primary action |
| --- | --- | --- |
| / | Research graph canvas | Select/register study |
| /studies/new | Study registration sheet | Register study |
| /studies/[id] | Study dossier | Claim relation |
| /relations/new | Relation comparison | Submit relation |
| /relations/[id] | Method matrix | Run adjudication |
| /neighbors/[id] | Semantic neighbor drawer | Open candidate |
| /receipts/[id] | Edge receipt | Copy/explorer |

The visual composition for each route is specified in `ui/ux.md`.

## 12. Functional requirements

### FR-1 — Public browsing

Where a record is public, the user can inspect it without connecting a wallet.

### FR-2 — Explicit wallet identity

Wallet connection occurs only after user action. Production writes are injected-wallet only and network-gated.

### FR-3 — Versioned top-level configuration

Rules/charter/rubric/manifests that affect a decision are versioned and visible in the resulting receipt.

### FR-4 — Off-chain work plane

Routine/high-volume work does not require one transaction per action.

### FR-5 — Immutable escalation

Before chain submission, the user can inspect the exact bounded artifact/reference/digest being committed. Editing afterward produces a new digest/version.

### FR-6 — Related-memory preview

The product can show relevant semantic memories, clearly labeled as related context.

### FR-7 — Consensus trigger

The eligible actor can trigger the project-specific review. Long-running consensus is represented as stages, not fake percentage progress.

### FR-8 — Fail closed

Unavailable evidence, malformed outputs, stale state or validator disagreement cannot silently become a positive decision.

### FR-9 — Authoritative receipt

A final receipt includes record ID, contract/network, input version/digests, memory IDs, decision-critical output, tx/finality and resulting state.

### FR-10 — Append-only history

Historical decisions remain inspectable after later versions/corrections.

### FR-11 — Integrator surface

Stable view methods expose machine-readable final status.

## 13. Product-specific contract capabilities

- register_study(title, question_text, method_text, conclusion_text, manifest_url, manifest_digest, publication_ref) -> study_id
- update_study_metadata(study_id, correction_url, correction_digest) -> version
- claim_relation(source_study_id, target_study_id, claimed_relation, evidence_url, evidence_digest) -> claim_id
- adjudicate_relation(claim_id) -> edge
- get_study(study_id)
- get_relation(claim_id)
- list_edges(study_id, offset, limit)
- search_related(study_id, field_kind, k)

## 14. Product-specific rules

- A relation edge always points to two existing immutable study versions.
- CONTRADICTORY_RESULT requires comparability; otherwise INCOMPARABLE.
- Semantic similarity alone cannot create an edge.
- Corrections increment study version and do not rewrite historical edge evidence.
- One claim produces at most one accepted edge.
- Public manifest digest is bound at registration.

## 15. Public evidence requirements

- HTTPS/content-addressed and validator-accessible.
- Digest/version bound.
- Bounded before prompt construction.
- Treated as untrusted data.
- No private secrets in chain/VecDB.
- Unavailable source produces no invented positive result.

## 16. Primary demo fixture

Study A tests treatment X in adults with method M and finds positive effect. Study B repeats M/population and finds no effect: potentially CONTRADICTORY_RESULT. Study C uses different population/method and should be MATERIAL_VARIANT, not contradiction.

The fixture should seed local UI/direct tests. It is not proof until a corresponding live StudioNet path is executed.

## 17. Required edge behavior

- Same research question but materially different population/method: MATERIAL_VARIANT, not direct replication.
- Same method but different question: EXTENSION or INCOMPARABLE.
- Opposite conclusion from incomparable data: must not be called contradiction.
- Paper metadata changes after DOI publication; core manifest digest remains immutable.
- Target study is later corrected; old edges remain version-bound and a new relation claim may be opened.

## 18. UX requirements

UI identity:

- **Archetype:** scientific notebook and instrument panel with graph-paper logic
- **Signature:** The relation view is a three-row scientific comparison table: Question / Method / Conclusion, with vector neighbors as specimen tabs. Graph edges use different stroke patterns rather than rainbow colors.
- **Fonts:** STIX Two Text for scientific titles/abstract-like text; IBM Plex Sans for UI; IBM Plex Mono for identifiers
- **Geometry:** graph paper backgrounds only in analysis areas, crisp square panels, 3px radius, thin axis lines
- **Motion:** graph node focus and edge tracing only; no physics-bounce default

The wallet must remain utility chrome. The main artifact/work object dominates.

## 19. Security requirements

1. Backend never signs GenLayer writes.
2. Wrong-chain writes are blocked both in UI and client helper.
3. Finalized rollback/error is not success.
4. Unknown RPC/contract shape fails closed.
5. Prompt-injection-like fetched content cannot alter governing rules.
6. Similarity cannot directly authorize state.
7. Stale versions cannot mutate newer state.
8. Decision enums/IDs are deterministically bounded.
9. Public storage contains no secrets/private source material.
10. No live-mode fabricated fallback.

## 20. Success metrics

- 100% of writes injected-wallet signed.
- 100% final successes verified through GenVM execution + authoritative re-read.
- 0 silent fixture fallback in live mode.
- 0 VecDB distance displayed as truth/confidence.
- 100% final decisions expose input versions/digests.
- One happy-path and one fail-closed/abstain path demonstrated before release.
- Fresh agent can implement from this pack + repository files without prior chat context.

## 21. Acceptance criteria

- [ ] Contract state/API implements the intended domain lifecycle.
- [ ] Direct tests cover every invariant.
- [ ] VecDB insert/retrieval rules are tested.
- [ ] Validator rejects a well-formed wrong leader payload in direct mode where tooling permits.
- [ ] Off-chain service cannot author chain truth.
- [ ] Hosted UI follows `ui/ux.md`.
- [ ] Hosted UI reads deployed StudioNet state.
- [ ] Contract schema verified.
- [ ] StudioNet consensus path proven.
- [ ] Wallet/network regressions tested.
- [ ] Deployment facts recorded in `handoff.md`/`memory.md`.
- [ ] README/submission copy distinguishes live proof from direct-test coverage.

## 22. Reference end-to-end demo

Register five synthetic/public studies with overlapping questions, claim a direct replication and a contradictory-result relation, show three-field semantic neighbors, adjudicate edges, then explore the resulting graph.
