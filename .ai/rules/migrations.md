---
paths:
  - 'database/migrations/**'
---

# Migrations

## Consolidate schema into create migrations
Pre-production: fold alter migrations into the original create migrations (users SSO/2FA/nullable password, hydrant ukuran default). Keep Spatie permission migration untouched. Seed permissions via seeders, never DML migrations. Always drop child tables before parents in down().
