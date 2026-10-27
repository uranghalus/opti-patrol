# Aturan: UI & Layout (resources/js/layouts/**, resources/js/components/**)

## Layout default
- Gunakan **`AppSidebarLayout`** (`@/layouts/app/app-sidebar-layout`) untuk semua halaman aplikasi. Ia sudah terdaftar sebagai default di `app.tsx` melalui `app-layout.tsx`.
- **Jangan** aktifkan atau gunakan `AppHeaderLayout` (konten tanpa `max-width`, tidak ramah tabel/rekap data-dense).
- Jeda konten: `max-w-[1400px] mx-auto`, gutter 12px mobile → 16px tablet → 32px desktop, header desktop 64px sticky.

## Navigasi (sinkronisasi wajib)
- `MobileHeader` drawer harus menyajikan **seluruh** section yang sama dengan `AppNav` desktop: Dashboard, Role Management, Data Master, Fire Safety, Inspeksi, Reports. Jangan menghapus section saat menambahkan halaman baru.
- `MobileTabBar` hanya boleh merujuk **route yang terdaftar** di `routes/web.php`. Jika route exact belum ada (misal `/reports`), arahkan ke sub-route valid dan tandai dengan komentar `FIXME` untuk difollow-up dengan user.
- Setiap halaman baru yang ditambahkan ke `AppNav` wajib ditambahkan pula ke `drawerSections` di `MobileHeader`.

## Komponen kartu & form
- Gunakan kartu putih (`--card`) dengan border 1px `#E5EDF5`, radius 8px, dual-layer shadow (`--shadow-lg-stripe`).
- Tombol primer: bg `#005377`, teks `#ffffff`, radius 4px, tinggi 40px.
- Setiap elemen klikable: `cursor-pointer` + state hover/active/terlihat.
- Ikuti `Design.md` untuk warna, tipografi, dan elevasi. Jangan menciptakan gaya inline yang berselisih dengan design token.

## Aksesibilitas & sentuh
- Target sentuh ≥ 44×44px (tab mobile, item drawer, item dropdown).
- Fokus terlihat: outline 2px `--ring`, offset 2px.
- Hormati `prefers-reduced-motion` (durasi animasi/transisi → 0.01ms).
- Tidak ada emoji sebagai ikon; gunakan Lucide SVG.
