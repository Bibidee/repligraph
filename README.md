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

Verified StudioNet deployment: `0x7cd6075d0989F2b8640beeD28128BBBC828F3cE6` (tx `0x5e2851568ef1a13c178e925e6c395b2388d3b34b941a82b9dcff4d739914393e`). A live `register_study` write was also verified (tx `0x6cf1d79c87c64ca520c401ed0d748a19f20b69b9aa347063880bbbeeb829a720`).
