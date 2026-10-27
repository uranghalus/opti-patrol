# TODO — Audit & Rebuild UI Layout (OptiPatrol)

## Status: SELESAI
Brand primer: **#005377**, Palet colorful: #005377, #007994, #009E9D, #32C292, #97E17E, #F9F871

## Hasil langkah 1–7
- [x] 1. AppSidebarLayout = layout tunggal (sudah default di app.tsx); AppHeaderLayout tidak digunakan
- [x] 2. `Design.md` dibuat (root repo) sebagai SOT design system (diupdate dengan palet colorful + role-based variant)
- [x] 3. `app.css` diupdate: #533afd → #005377, hilangkan gradient chrome/neumorfis, dark mode foreground brand #5fb4d6
- [x] 4. `MobileHeader` drawer sinkron desktop (tambah Dashboard + Inspeksi)
- [x] 5. `MobileTabBar` sinkron route (Laporan → /reports/apar-rekap + FIXME)
- [x] 6. Typografi Inter/sohne-var + brand #005377 (tercermin CSS + Design.md)
- [x] 7. `.ai/rules/` dibuat (index.md, 01-ui-layout.md, 02-css-design.md)

## Bonus: Dashboard Role-Based + A11y Fix + StatCard (selesai)
- [x] `resources/js/pages/dashboard.tsx`: Compliance-first + Alerts-first, StatCard mengganti AlertCard
- [x] `resources/js/components/dashboard/StatCard.tsx` (baru): komponen stat card sesuai referensi gambar
- [x] `resources/js/components/dashboard/`: 5 komponen (ScanButton, ComplianceGauge, ExpirationCountdown, BlindSpotList, InspectionTrendChart) + StatCard
- [x] `resources/js/components/ui/button.tsx`: diupdate (gradasi brand, radius 12px, efek lift)
- [x] tsc: tidak ada error
- [x] Prettier: diformat
- [x] detect.mjs: [] (clean)

## Perbaikan Aksesibilitas (baru)
- [x] `window.location.href` → `<Link asChild>` (Inertia SPA, tidak full reload)
- [x] ARIA: progressbar, aria-label pada angka value, role="status" aria-atomic pada badge
- [x] `pt-24` kompensasi sticky nav 64px
- [x] Grid metrik `md:grid-cols-2 lg:grid-cols-4` untuk tablet

## Tindak lanjut ke user
- Supermemory belum tersedia sebagai tool; catatan vault perlu disinkronkan manual (mode add).
- ReactBit belum terinstall (tidak ada di package.json). Digunakan shadcn/ui sebagai pengganti.
- MobileTabBar tab Laporan: konfirmasi tujuan agregat Laporan yang diinginkan user.
- Tombol Scan QR masih arahkan ke `/inspection` (placeholder). Butuh implementasi halaman scan QR yang benar.
- Konfirmasi field role pada `auth.user` (saat ini baca `role` / `peran` / `role_name`).
