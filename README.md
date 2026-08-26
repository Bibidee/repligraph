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

## Verification

```powershell
cd apps/web
npm run typecheck
npm run lint
npm run build
```

The earlier StudioNet deployment `0x634a6B4eA931fE258cb81ef471280F14c0ea24A3` (tx `0xb2724e214bc487224c8ab21afa8d3589a058088ce681f9b08efc21a8ca7d62b4`) verified studies 1 and 2, semantic search, claim `1`, adjudication, and an accepted `DIRECT_REPLICATION` edge. It is superseded by the versioned-study and edge-integrity source changes in commit `d7f53a8`; do not use it as the final release address until a fresh deployment is completed.

Current release status: frontend build passes, but fresh deployment is blocked by the encrypted CLI keystore prompt in this environment. Python integration tests and injected-wallet popup tests are also unavailable here.
