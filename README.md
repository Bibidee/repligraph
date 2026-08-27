# RepliGraph

RepliGraph is a semantic replication graph for public scientific experiments. Researchers register immutable study versions, discover related work through separate question, method, and conclusion memories, and ask GenLayer validators to settle a typed relation between two pinned study versions.

Semantic similarity proposes candidates. It never decides scientific truth. Accepted edges are created only after validator consensus.

## Production release

- Application: [repligraph.vercel.app](https://repligraph.vercel.app)
- Network: GenLayer StudioNet, chain ID `61999`
- Contract: `0xc09430347945C4311A539a3D91D0bB36a0DbDE2D`
- Deployment transaction: `0x87838308bfba26d3e12412f1836fa8b9c9a7dc3caff9f6b81a6988b9ec2da079`
- Frozen contract SHA-256: `1154D159BE50BB16D3F2980AC30C0421FF3C6B8A13E1E8FE1834B159998AA976`

The final live proof registered studies 1 and 2, found study 2 through QUESTION, METHOD, and CONCLUSION search, created claim 1, and finalized adjudication with validator majority agreement. Claim 1 is `EDGE_ACCEPTED`; edge 1 is `DIRECT_REPLICATION`.

## Architecture

`contracts/repligraph.py` is the only stateful backend. It owns study registrations and corrections, immutable versions, relation claims, accepted edges, adjudication receipts, and three independent VecDB stores. The Next.js application in `apps/web` reads StudioNet directly and sends writes through the user's injected wallet. There is no application database, custodial signer, or hidden API.

The contract treats fetched evidence as untrusted data, validates bounded consensus envelopes, pins relation claims to exact study versions, and preserves historical vectors while returning only current versions from latest-only semantic search.

## Local development

```powershell
cd apps/web
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_REPLIGRAPH_CONTRACT` in `.env.local` to the deployed StudioNet address above.

## Verification

```powershell
python -m pytest -q
cd apps/web
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

Final results: 95 Python tests passed, 38 frontend tests passed, typecheck passed, lint passed, production build passed, and npm reported zero vulnerabilities.

## Live lifecycle proof

- Register study 1: `0x60f5a6a39e438ab70bcf4a7ecd9730b4191d2564791d8c5e177cce61fcd89f0b`
- Register study 2: `0x335ee04bf1b1e714bdb554d69b4a7bf2a75b360b0bc3854541737d48408980f6`
- Claim relation 1: `0xd6a3c57018dea767c8dea930bd7b2d0ac672b705d01b9525aaf66e0dccf7cfd3`
- Adjudicate relation 1: `0xd7855702e0f6a7cb8d0d6d3b5f8f43ffe6226fcc4ca8e08e892d2c031a58c19f`

The adjudication receipt is `FINALIZED`, execution is `SUCCESS`, and the consensus result is `MAJORITY_AGREE`. Authoritative reads return claim 1 as `EDGE_ACCEPTED` and edge 1 as `DIRECT_REPLICATION`.

## Historical note

Earlier StudioNet addresses and retryable adjudication results are superseded by this source-parity deployment and accepted-edge proof.
