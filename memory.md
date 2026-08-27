# RepliGraph Project Memory

## Current verified state

- Product: a public semantic replication graph for scientific experiments.
- Architecture: one GenLayer Intelligent Contract plus a directly hosted Next.js frontend. No backend database or custodial signer.
- Production: `https://repligraph.vercel.app`.
- StudioNet contract: `0xc09430347945C4311A539a3D91D0bB36a0DbDE2D`.
- Deployment transaction: `0x87838308bfba26d3e12412f1836fa8b9c9a7dc3caff9f6b81a6988b9ec2da079`.
- Frozen contract SHA-256: `1154D159BE50BB16D3F2980AC30C0421FF3C6B8A13E1E8FE1834B159998AA976`.
- Validation: 95 Python tests, 38 frontend tests, typecheck, lint, production build, schema retrieval, npm audit, and responsive route QA passed.
- Live lifecycle: study 1 and study 2 registered; all three semantic fields returned study 2; claim 1 finalized; adjudication reached validator majority agreement; claim 1 is `EDGE_ACCEPTED`; edge 1 is `DIRECT_REPLICATION`.
- Remaining repository-controlled critical or high issues: none.

## Product boundaries

Raw datasets, notebooks, compute, and papers remain in public archives. The contract stores bounded manifests, hashes, URLs, immutable study versions, semantic pointers, claims, receipts, and accepted relation edges.

Semantic retrieval uses independent QUESTION, METHOD, and CONCLUSION stores. Similarity proposes related studies and never establishes replication. Adjudication pins source and target versions and settles one of the supported relation classes through GenLayer consensus.

## Durable engineering decisions

- StudioNet chain ID is `61999`; default RPC is `https://studio.genlayer.com/api`.
- Wallet connection is explicit and is never restored or requested automatically.
- Every write revalidates provider, chain, and current account immediately before signing.
- Live reads pass through strict runtime parsers and surface unavailable or malformed states truthfully.
- Study corrections preserve historical vectors, while latest-only search excludes stale pointers and deduplicates by `(study_id, version)` before filling `k`.
- Evidence fetched during adjudication is delimited and treated as untrusted content.
- Relation claims and accepted edges use separate identifiers.
- No CI workflow is used for this release; validation was executed locally and against StudioNet.

## Final live proof

- Registration 1: `0x60f5a6a39e438ab70bcf4a7ecd9730b4191d2564791d8c5e177cce61fcd89f0b`
- Registration 2: `0x335ee04bf1b1e714bdb554d69b4a7bf2a75b360b0bc3854541737d48408980f6`
- Relation claim: `0xd6a3c57018dea767c8dea930bd7b2d0ac672b705d01b9525aaf66e0dccf7cfd3`
- Adjudication: `0xd7855702e0f6a7cb8d0d6d3b5f8f43ffe6226fcc4ca8e08e892d2c031a58c19f`
- Accepted edge: edge 1, claim 1, `DIRECT_REPLICATION`, study 1 v1 to study 2 v1.

All earlier deployment addresses and retryable adjudication notes are historical and superseded.
