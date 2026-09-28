# Architecture

```mermaid
flowchart LR
  Browser[React desktop dashboard] --> API[Django REST API]
  API --> ML[Pure Python scoring modules]
  API --> DB[(SQLite demo / PostgreSQL production)]
  API --> Chain[AgreementRegistry local or testnet]
  ML --> Explain[Reasons, signals, clause offsets]
```

The local demo intentionally keeps scoring deterministic and offline. Production adapters can replace the SQLite store, object storage, identity verifier, transformer models, and public chain client without changing the explainable result contracts.
