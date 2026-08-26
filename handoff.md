# RepliGraph — Handoff Log

> **Mandatory living log.** `AGENTS.md` requires an agent to append here immediately after every meaningful work unit, before starting the next one. This is the operational continuity file; it must describe what actually happened, not what was intended.

## Current checkpoint

- **Phase:** Initial implementation and direct-client wiring.
- **Last completed work:** Added the contract, direct GenLayer client/read/write/finality modules, wallet/network gate, and all documented deep-link UI surfaces.
- **Next exact action:** Complete dependency installation in an environment with registry access, then run the frontend verification commands and validate the contract against the GenLayer CLI.
- **Known blockers:** None yet. Runtime/API mismatches discovered later must be logged rather than guessed around.
- **StudioNet address:** Not deployed.
- **Deployment commit:** Not available.
- **Frontend URL:** Not deployed.

## Immediate implementation sequence

1. Read `memory.md`, `prd.md`, `architecture.md`, `trd.md`, `ui/ux.md`.
2. Scaffold repository folders and package manifests.
3. Add the contract dependency header and storage dataclasses.
4. Add deterministic input/state helpers and direct tests.
5. Add VecDB insertion/retrieval with bounded namespace filters.
6. Add the consensus path and decision envelope.
7. Build live chain client/wallet plumbing.
8. Build the distinct UI from `ui/ux.md`.
9. Add any off-chain service described in `architecture.md`.
10. Run direct/local checks, then real StudioNet integration.
11. Deploy and record exact proof here and in `memory.md`.
12. Only then create final README/submission material.

## Log entry template

Copy this block for every meaningful work unit:

```md
### YYYY-MM-DD HH:MM TZ — <short work-unit title>

**Goal**
- What this work unit was supposed to accomplish.

**Changed**
- Exact files/modules changed.
- Exact contract/API/schema/UI behavior changed.

**Verification**
- Commands/tests run.
- Real pass/fail counts or concise output.
- If not run, say `NOT RUN` and why.

**Reality check**
- What is proven.
- What is still assumed or unproven.
- Any discrepancy between docs and code corrected in the same work unit.

**Decisions**
- Durable decisions made. If any, also update `memory.md`.
- `None` if none.

**Blockers / risks**
- Concrete blocker, or `None`.

**Next exact action**
- One explicit next task, not a vague “continue building”.
```

## Initial log

### 2026-08-23 19:10 +01:00 — Blueprint pack created

**Goal**
- Produce enough durable specification that a capable coding agent can build RepliGraph with a minimal prompt and without relying on hidden conversation context.

**Changed**
- Added `AGENTS.md`.
- Added `project-plan.md`.
- Added `prd.md`.
- Added `trd.md`.
- Added `ui/ux.md`.
- Added `handoff.md`.
- Added `memory.md`.
- Added `architecture.md`.

**Verification**
- Documentation-only work; no source code, tests, deployment or live endpoint exists yet.
- Cross-document invariants were generated from one project specification to reduce contradictory APIs.

**Reality check**
- Product, architecture and UX are specified.
- Nothing is yet proven on StudioNet.
- No transaction hash, address, URL or test result should be claimed.

**Decisions**
- Use StudioNet / chain 61999 and `genlayer-js` 1.1.8.
- Injected-wallet-only writes.
- VecDB is retrieval, never verdict.
- Distinct UI language is mandatory.

**Blockers / risks**
- Exact GenVM/SDK runtime compatibility must be verified during implementation; do not assume documentation alone proves deployment.

**Next exact action**
- Scaffold the repo and implement deterministic contract types/state plus direct tests.

### 2026-08-25 23:45 +01:00 — Initial product scaffold

**Goal**
- Move from the documentation-only blueprint to a coherent contract/frontend implementation baseline.

**Changed**
- Added `contracts/repligraph.py` with bounded `Study`, `RelationClaim`, `Edge`, and `VectorPointer` storage records; permissionless registration/claims/adjudication; registrant-only correction versioning; immutable version-bound edges; separate QUESTION/METHOD/CONCLUSION semantic memories; bounded KNN retrieval; strict decision enum validation; and fail-closed contradictory-result comparability handling.
- Added `apps/web` Next.js 16 / React 19 package and config, project-specific global CSS, live data-source/schema/config modules, wallet provider with explicit connect and account/chain/disconnect tracking, research graph landing screen, and study registration sheet.
- Added `.gitignore`.

**Verification**
- `rg --files` confirms all new source files exist.
- NOT RUN: dependency install/typecheck/build; GenLayer runtime validation and StudioNet deployment remain outstanding.

**Reality check**
- The UI currently truthfully renders the no-contract/unavailable state and does not fabricate records.
- The direct GenLayer read/write adapter is still the next integration unit; the UI write action currently reports configuration/session state rather than claiming a transaction succeeded.
- No deployment address or transaction evidence exists.

**Decisions**
- Keep the first implementation within the documented two-layer architecture: one Intelligent Contract plus one Next.js frontend; no application database or backend service.

**Blockers / risks**
- Exact `genlayer-js` and GenVM contract syntax must be verified against the installed toolchain before deployment.

**Next exact action**
- Install web dependencies and run typecheck/build; fix concrete compiler errors before adding the remaining deep-link screens.

### 2026-08-25 23:58 +01:00 — Direct client and route completion

**Goal**
- Wire the frontend to the documented GenLayer SDK architecture and cover the complete MVP route map.

**Changed**
- Added `apps/web/lib/genlayer/client.ts`, `contract.ts`, and `execution.ts` using `genlayer-js` 1.1.8, `studionet`, direct read/write clients, FINALIZED receipt polling, and explicit GenVM execution inspection.
- Updated `data-source.ts` so configured live reads call the direct SDK and missing configuration remains an explicit unavailable state.
- Added shared chrome and routes for study dossiers, relation comparison, method matrix, semantic neighbors, and authoritative receipts.
- Added README, `.env.example`, and deterministic invariant tests.

**Verification**
- `node node_modules/typescript/bin/tsc --noEmit` ran against the partially installed dependency tree. The remaining errors are missing Next module/type files because npm installation did not complete; concrete GenLayer argument/finality type errors were fixed.
- `npm install --ignore-scripts --prefer-offline` was attempted twice with escalation and stalled without a registry completion; stopped after no output.
- NOT RUN: production build, lint, contract runtime tests, CLI deployment.

**Reality check**
- No contract address, deployment transaction, or live lifecycle evidence exists.
- The registration and adjudication UI actions are session/configuration truthful; only the SDK write helper performs a real transaction once invoked by a fully wired form.

**Decisions**
- Use the SDK's current `waitForTransactionReceipt({ hash, status })` surface and inspect `txExecutionResultName`; do not treat FINALIZED alone as success.

**Blockers / risks**
- The sandbox's npm registry/install path is currently stalling, leaving Next's package tree incomplete. GenLayer CLI availability and StudioNet funding are also unverified.

**Next exact action**
- Resume with completed npm dependencies, run `typecheck`, `lint`, and `build`, then inspect the local GenLayer CLI account and validate/deploy the contract where the toolchain permits.
## Verification handoff — 2026-08-26

StudioNet verification is complete. The official GenLayer CLI v0.39.2 is installed locally at `tools/genlayer-cli`; the unlocked `faultline-dev` account was used. The corrected contract is `0x7cd6075d0989F2b8640beeD28128BBBC828F3cE6` (deployment tx `0x5e2851568ef1a13c178e925e6c395b2388d3b34b941a82b9dcff4d739914393e`). A real `register_study` write succeeded with tx `0x6cf1d79c87c64ca520c401ed0d748a19f20b69b9aa347063880bbbeeb829a720`, and `get_study(1)` read back the stored record. Frontend `.env.local` points at this deployment.

Final workflow: deployed `0x634a6B4eA931fE258cb81ef471280F14c0ea24A3` with deployment tx `0xb2724e214bc487224c8ab21afa8d3589a058088ce681f9b08efc21a8ca7d62b4`. Studies 1 and 2 are readable, semantic search returns study 2, claim 1 finalized, and adjudication tx `0xb0d89d50483cdebea815a40c28070ac10ddcc803b4315aa5a1863b2814afcb86` produced `EDGE_ACCEPTED` with `DIRECT_REPLICATION`. Python is unavailable, so Python tests remain not run.
## 2026-08-26 closure pass

Latest local commit: `d7f53a8`.

The contract source now preserves immutable study versions, stores edges by a dedicated edge ID, exposes `get_study_version`, `list_studies`, and `list_edges_global`, keeps historical semantic vectors searchable, validates SHA-256 digests, and rejects malformed consensus envelopes. The frontend wallet control now separates address copy from disconnect and blocks writes when the wallet is not on StudioNet.

The previously deployed address `0x634a6B4eA931fE258cb81ef471280F14c0ea24A3` is superseded by this source change and must not be presented as the final deployment until a fresh deployment is completed.

The local Next production build passes. Fresh StudioNet deployment is currently blocked because the installed CLI is prompting for the encrypted `faultline-dev` keystore password in this process. No password or private key has been guessed or fabricated. Python is also unavailable, so Python and GenLayer integration tests cannot be run here. Wallet popup tests require an injected MetaMask or Rabby provider, which this browser session does not expose.
## 2026-08-26 corrective pass after 86a5881

Commit `685897d` fixes the StudioNet chain constant (`61999` / `0xf22f`), returns `edge_id` from successful adjudication, adds pinned StudyVersion reads and a live relation adjudication action, and adds null-safe data-source types. Production Vercel deployment `web-3tr9lkfh4-bibidees-projects.vercel.app` is aliased to `https://repligraph.vercel.app`.

The contract has not been redeployed after these source changes. The CLI still requires the encrypted `faultline-dev` keystore password, and StudioNet schema requests are blocked by the current network sandbox. The release remains deployment-pending.

Focused pre-deployment correction: `search_related` scope bug fixed and regression guards added. Frozen source hash: `96E83C7EF4DB0FDEA6CC8EE78A29B49458699600A9EE400DDA21D33192EF67E1`.

Final deployment completed on StudioNet: `0x9A32B51b9FA6B6f2Cdb9726B936D95Da6665dF5c`, tx `0xfd1a5d621477269647327ac1ca24069b845433bfd1ef2f2bd75362c1ba40fbdc`. Live checks confirmed studies 1 and 2, Study B versions 1 and 2, semantic search returning current v2 across QUESTION, METHOD, and CONCLUSION, claim 1 returning INSUFFICIENT on failed evidence fetch, and claim 2 also failing closed with edge return 0. Production frontend now points to this address at https://repligraph.vercel.app.
