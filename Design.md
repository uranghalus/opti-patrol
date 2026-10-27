# Design.md — OptiPatrol Design System

**Status:** Source of Truth (SOT) untuk seluruh UI OptiPatrol.  
**Tanggal:** 2026-10-27  
**Dasar:** Direction Contract (enterprise-grade inspection ops, fintech clarity) + PRD Work Management System.

---

## 1. Filosofi Visual

- **White ground**, border 1px `#E5EDF5`, dual-layer shadow (Stripe-style elevation).
- Radius **4px kontrol** / **8px kartu**.
- Setiap state (hover, active, disabled) berbicara warna brand.
- **DITOLAK:** glassmorphism, neumorphic, cyan chrome gradient, bayangan melengkung bertumpuk tanpa lapis kontras.
- Mobile-first (petugas lapangan scan QR), desktop paling kaya data (tabel & rekap).

---

## 2. Warna (Palette)

Brand primer ditetapkan ke **`#005377`** (Deep Brand Navy) per keputusan tim. Palet warna diambil dari referensi "Generic Gradient" yang disetujui user:

| Warna | Hex | Peran |
|-------|-----|-------|
| Dark Navy | `#005377` | Brand primer, teks utama, border aktif |
| Teal Blue | `#007994` | Aksen sekunder, teks sekunder, hover state |
| Teal Green | `#009E9D` | Status baik / sukses, garis chart Hydrant |
| Mint Green | `#32C292` | Status peringatan ringan, latar aksen |
| Light Green | `#97E17E` | Latar aksen, badge sukses, gradasi |
| Yellow | `#F9F871` | Peringatan, highlight, kadaluarsa |

### Light mode (`:root`)

| Token | Nilai | Keterangan |
|-------|-------|------------|
| `--background` | `#ffffff` | Latar belakang aplikasi |
| `--foreground` | `#0a2540` | Teks utama (Deep Navy) |
| `--card` | `#ffffff` | Latar kartu |
| `--card-foreground` | `#425466` | Teks kartu (Steel Blue) |
| `--primary` | `#005377` | **Brand primer** |
| `--primary-foreground` | `#ffffff` | Teks di atas background brand |
| `--secondary` | `#007994` | **Aksen sekunder (Teal Blue)** |
| `--secondary-foreground` | `#ffffff` | Teks di atas background sekunder |
| `--muted` | `#f6f9fc` | Latar demur |
| `--muted-foreground` | `#64748d` | Teks demur |
| `--accent` | `#009E9D` | **Aksen utama (Teal Green)** |
| `--accent-foreground` | `#ffffff` | Teks di atas background aksen |
| `--destructive` | `#F9F871` | **Peringatan / Kadaluarsa (Yellow)** |
| `--destructive-foreground` | `#005377` | Teks di atas background peringatan |
| `--border` | `#e5edf5` | Garis pemisah |
| `--input` | `#e5edf5` | Border input |
| `--ring` | `rgba(0, 83, 119, 0.3)` | Focus ring |
| `--link` | `#005377` | Tautan |

### Dark mode (`.dark`)

| Token | Nilai |
|-------|-------|
| `--background` | `#0b111e` |
| `--foreground` | `#f6f9fc` |
| `--card` | `#111a2b` |
| `--card-foreground` | `#c6d3e2` |
| `--primary` | `#005377` (bg brand, teks putih di atasnya) |
| `--primary-foreground` | `#ffffff` |
| `--secondary` | `rgba(95, 180, 214, 0.15)` |
| `--secondary-foreground` | `#5fb4d6` |
| `--muted` | `#1a2333` |
| `--muted-foreground` | `#8fa3bf` |
| `--accent` | `rgba(95, 180, 214, 0.15)` |
| `--accent-foreground` | `#5fb4d6` |
| `--destructive` | `#ff7a92` |
| `--destructive-foreground` | `#0b111e` |
| `--border` | `#223049` |
| `--input` | `#223049` |
| `--ring` | `rgba(95, 180, 214, 0.4)` |
| `--link` | `#5fb4d6` |

> Catatan: di dark mode, `#005377` terlalu gelap sebagai teks pada latar gelap, sehingga teks/garis fokus/tautan menggunakan tint terang `#5fb4d6` agar kontras WCAG AA (≈6:1).

### Elevation (dual-layer Stripe shadow)

| Token | Nilai |
|-------|-------|
| `--shadow-md-stripe` | `rgba(0, 0, 0, 0.1) 0px 18px 36px -18px, rgba(50, 50, 93, 0.25) 0px 30px 45px -30px` |
| `--shadow-lg-stripe` | `rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px` |
| `--shadow-xl-stripe` | `rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px` |

---

## 3. Tipografi

| Peran | Font | Bobot |
|-------|------|-------|
| Semua teks | `sohne-var` (Inter pengganti) | 300 / 400 / 500 / 700 |
| Ukuran dasar body | 14px | line-height 1.4 |
| Heading | dituruskan dari `--font-sans` | 500 / 700 |

Satu stack tipografi saja di seluruh aplikasi. Jangan menambahkan font baru tanpa persetujuan.

---

## 4. Layout

| Elemen | Spesifikasi |
|--------|-------------|
| Layout default | `AppSidebarLayout` (via `app-layout.tsx` → `app.tsx`) |
| Header desktop | 64px, sticky, latar putih 0.95, border bawah 1px `#E5EDF5` |
| Header mobile | 56px, sticky, latar putih |
| Kolom konten | `max-w-[1400px]`, `mx-auto` |
| Gutter | 12px mobile → 16px tablet → 32px desktop |
| Nav bawah mobile | `MobileTabBar`, 56px, tab target ≥44px, safe-area bottom |
| Breadcrumb | Strip saat halaman menyediakan breadcrumb |
| Tata letak yang DITOLAK | `AppHeaderLayout` (tidak digunakan, konten tanpa max-width) |

---

## 5. Komponen & Interaksi

### Gaya Visual: Field Ops Elevated (Colorful)

- **Tombol primer**: bg gradasi `from-[#005377] to-[#007994]`, hover `from-[#007994] to-[#009E9D]`, radius 12px, tinggi 40px (mobile) / 44px (desktop), efek lift `-translate-y-0.5` saat hover, shadow lembut.
- **Kartu**: background putih dengan `backdrop-blur-sm`, border 1px putih transparan, radius 16–20px, bayangan dua lapis (`--shadow-md-stripe`), gradasi halus sebagai aksen di latar (bukan glass/neumorphis).
- **Hover interaksi**: kartu membesar `-translate-y-1`, bayangan menebal, border berwarna aksen.
- **Fokus terlihat**: outline 2px `--ring`, offset 2px.
- `prefers-reduced-motion`: durasi animasi/transisi → 0.01ms.
- Target sentuh ≥ 44×44px (tombol scan, item drawer, item dropdown).
- Tidak ada emoji sebagai ikon (gunakan Lucide SVG).
- Semua elemen klikable: `cursor-pointer` + state hover/active terlihat.

### Komponen Dashboard (resources/js/pages/dashboard.tsx)

Dashboard menggunakan **role-based variant** — first viewport menyesuaikan per role:

| Variant | Role | First Viewport |
|---------|------|----------------|
| **Compliance-first** | Supervisor, GM, Super Admin | Compliance card (progress bar %), scan button sekunder, lalu alert + blind spot |
| **Alerts-first** | Petugas / Inspector | Alert kadaluarsa, blind spot, metrik, scan button paling bawah |

Komponen yang digunakan:
- `Card`, `CardHeader`, `CardTitle`, `CardContent` (shadcn/ui) — kartu putih, radius 8px, border-none, shadow-sm
- `Button` (shadcn/ui) — tombol scan, bg `#005377`, hover `#007994`, radius 12px, ≥44px
- `Badge` (shadcn/ui) — status badge, varian default/destructive/secondary
- Ikon Lucide React: `Scan`, `ShieldCheck`, `Activity`, `AlertTriangle`, `Users`, `Building2`

### Aksesibilitas

- Kontras teks ≥ 4.5:1 pada latar putih
- Fokus ring terlihat untuk navigasi keyboard
- Hormati `prefers-reduced-motion`
- Tidak ada emoji sebagai ikon
- Semua elemen interaktif: `cursor-pointer` + state hover/active terlihat
- Anti-pattern yang dihindari (craft-floor): tidak ada hero-metric template, tidak ada kicker di atas heading, tidak ada progress ring sebagai pengganti konten, tidak ada glass/blur sebagai hiasan, tidak ada gradient teks

### Catatan ReactBit

ReactBit belum terinstall di project (`package.json` tidak mengandung dependensi ini). Komponen interaktif saat ini menggunakan shadcn/ui. ReactBit dapat dipasang nanti untuk komponen interaktif yang lebih kaya (misalnya toggle status, kartu interaktis animasi) setelah persetujuan dependensi.

---

## 6. Klasifikasi Kelas CSS (migrasi dari `neu-*`)

Kelas `neu-*` (sejarah: neumorfis) **diperbarui visualnya agar sesuai Contract** — fill padat, border 1px `#E5EDF5`, dual-layer shadow, interaksi brand `#005377`, **tanpa gradient chrome**. Nama kelas dipertahankan untuk meminimalkan diff, tetapi visualnya sekarang sepenuhnya flat/Stripe, bukan neumorfis.

---

## 7. Anti-Pattern (hindari)

- Gradient biru→ungu pada ikon/tab (cyan chrome).
- Konten tanpa `max-width` di layar lebar.
- Navigasi mobile drawer yang lebih pendek dari nav desktop.
- Warna primer yang tidak konsisten di light/dark.

---

**Referensi:** `resources/js/layouts/app/app-sidebar-layout.tsx` (Direction Contract komentar), `resources/css/app.css` (token implementasi), PRD `PRD_Work_Management_System.md`.
