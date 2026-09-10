# Work Management System (WMS) — PRD

## Problem

Inspeksi APAR, Hydrant, dan Checkpoint Security masih mengandalkan checklist kertas. Akibatnya:
- Tidak ada bukti petugas benar berada di lokasi saat inspeksi
- Inspeksi yang terlewat tidak terdeteksi secara real-time
- Data kadaluarsa APAR tidak terpantau — risiko perangkat tidak fungsional saat kebakaran
- Laporan bulanan harus dikumpulkan manual dari petugas lapangan

## Evidence

- Codebase existing — Application already built with 3 inspection modules (APAR, Hydrant, Checkpoint Security), QR scanner, CRUD master data, Excel import, PDF export, dashboard
- Inspection fields detail — Form APAR captures `tanggal_kadaluarsa`, `kondisi`, `foto`. Form Hydrant captures 8 components (valve, hose, nozzle, alarm, dll). Form Checkpoint captures 7 risk categories (leak, fire_potential_api, fire_potential_user, leak_photo, gebahapa…).
- Dashboard analytics — Shows count of expired APAR, 6‑month inspection graph, and list of failing APAR

## Users

- Primary: Petugas lapangan (Inspector) — diagonal QR, fill inspection form via mobile
- Secondary: Supervisor — monitors daily inspections, receives tardiness alerts
- Tertiary: General Manager — receives escalation if supervisor fails to follow up
- Admin: Super Administrator — manages master data, prints QR Code, manages users/roles
- Not for: Public — internal business application only

## Hypothesis

We believe QR‑based inspection system with automated escalation will increase inspection compliance from <40% to >95% within 3 months. Success metrics: on‑time inspection rate ≥95% and zero overdue expired APAR left untouched.

## Success Metrics

| Metric | Target | How measured |
|--------|--------|--------------|
| Percentage of on‑time inspections | 95% | Inspections performed on schedule / total scheduled |
| Expired APAR not addressed | 0 | Count of APAR with `tanggal_kadaluarsa` < today and no later inspection |
| Tardy alert response time | <24h | Delay between overdue inspection and first action |

## Scope

MVP — Inspection modules for APAR and Hydrant with QR scan, basic form input (condition, photo), 1‑day WhatsApp tardiness alert, simple dashboard.

Out of scope
- Geolocation integration — optional per code
- Online training module — not in code
- ERP/SAP enterprise integration — no planned work

## Delivery Milestones

| # | Milestone | Outcome | Status | Plan |
|---|-----------|---------|--------|------|
| 1 | Basic APAR inspection | Staff can scan QR, input condition/photo, save inspection | pending | — |
| 2 | WhatsApp tardiness notification | System notifies Supervisor when inspection overdue 1 day | pending | — |
| 3 | Inspection dashboard | Display monthly inspection graph and list of expired APAR | pending | — |

## Open Questions

- [ ] Is geolocation integration required for inspection validation?
- [ ] How frequently should inspection data be archived?

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Petugas inconsistent QR usage | Medium | High | Retraining + incentives |
| WhatsApp gateway delay | Low | Medium | Fallback to email + in‑app notifications |
| Exceeding S3 storage quota | Low | High | Photo compression policy + retention rules |

---
*Status: DRAFT — requirements only. Implementation planning pending via `/plan`.