# RepliGraph

RepliGraph is a semantic replication graph for public scientific experiments. It settles an immutable relation edge between two public study versions using GenLayer consensus; semantic vectors provide bounded context and never decide truth by themselves.

## Local development

```powershell
cd apps/web
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_REPLIGRAPH_CONTRACT` to a deployed StudioNet contract before expecting live reads. Without it, the app intentionally shows a truthful unavailable state.

## Contract

`contracts/repligraph.py` is the single deployable Intelligent Contract. It owns studies, immutable version corrections, relation claims, accepted edges, consensus receipts, and three-field semantic memory. Deployment requires the GenLayer CLI and a funded StudioNet development account; no application-user private key is used by the frontend.

## Final StudioNet release

Status: **COMPLETE EXCEPT EXTERNAL STUDIONET NONDETERMINISTIC-RUNTIME LIMITATION**

- Contract: `0xE3487c2CCA45cc3F5C48e54f5c27cac1AEA6c848`
- Deployment transaction: `0x3eb9bff8aae7e78c22c9784d229c37dcdfda509a9a8757515197c36f938f88e2`
- Source SHA-256: `40A9C1BC4BDBC1398F2F70D46773E3F0DF310627552FE0D1E9B7BDF8749D3015`
- Production: [repligraph.vercel.app](https://repligraph.vercel.app)

Validation:

- 9 deterministic/domain/source tests passed
- TypeScript typecheck passed
- ESLint passed
- production build passed
- contract schema retrieval passed
- full GenLayer Direct Mode suite was unavailable in the current environment

The final lifecycle registered source study 1 and target study 2, returned target 2 from QUESTION, METHOD, and CONCLUSION searches, and finalized claim 1 and its adjudication transaction. The authoritative result is `REVIEW_RETRYABLE` with rationale `Nondeterministic evaluation failed.` No edge was created, and production exposes `Retry adjudication`.

StudioNet nondeterministic evaluation was unavailable during final adjudication. RepliGraph therefore failed safely and created no relation edge. No accepted-edge result is claimed without validator confirmation.

## Local verification

```powershell
cd apps/web
npm run typecheck
npm run lint
npm run build
```

## Historical deployments

- **SUPERSEDED:** `0x634a6B4eA931fE258cb81ef471280F14c0ea24A3`, tx `0xb2724e214bc487224c8ab21afa8d3589a058088ce681f9b08efc21a8ca7d62b4`.
- **HISTORICAL:** contract source at commit `c797825`, SHA-256 `96E83C7EF4DB0FDEA6CC8EE78A29B49458699600A9EE400DDA21D33192EF67E1`.
