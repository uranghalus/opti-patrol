# Aturan Tim OptiPatrol — Indeks

File-file di bawah ini adalah **load-bearing guidance** (bukan sekadar catatan) yang harus diikuti setiap agen/tipe saat mengubah kode di path yang tercantum. Sebelum membuat atau mengedit file, baca aturan yang glob-nya mencakup path tujuan.

| Path glob | File aturan | Isi singkat |
|-----------|-------------|-------------|
| `resources/js/layouts/**` | `01-ui-layout.md` | Layout default, komponen nav, sinkronisasi mobile/desktop |
| `resources/js/components/**` | `01-ui-layout.md` | Komponen shell (AppNav, MobileHeader, MobileTabBar, Breadcrumbs) |
| `resources/css/app.css` | `02-css-design.md` | Design tokens, warna brand, elevasi, klasifikasi kelas `neu-*` |
| `resources/js/pages/**` | `01-ui-layout.md` | Penggunaan layout & kartu di halaman |

## Prinsip inti
- Layout default (dan tunggal) untuk aplikasi adalah **`AppSidebarLayout`** (via `app-layout.tsx` → `app.tsx`). `AppHeaderLayout` tidak digunakan.
- Warna brand primer: **`#005377`** (ganti `#533afd` lama).
- Desain acuan: file **`Design.md`** di root repo (single source of truth).
- Kelas `neu-*` dipertahankan nama-nya tetapi **visualnya diupdate agar flat/Stripe** (fill padat, border 1px `#E5EDF5`, dual-layer shadow, interaksi brand `#005377`, **tanpa gradient chrome/neumorfis**).
- Satu stack tipografi saja: `sohne-var` (Inter pengganti), bobot 300/400/500/700.
- Jangan menambahkan font, warna, atau kelas utilitas kustom baru tanpa persetujuan dan pembaruan `Design.md`.
