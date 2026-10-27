# Aturan: Desain & CSS (resources/css/app.css)

## Design tokens (sumber kebenaran: `Design.md`)
- Warna brand primer: **`#005377`**. Jangan kembali ke `#533afd` di mana pun.
- Latar: `#ffffff`; teks utama: `#0a2540` (Deep Navy); teks sekunder: `#425466` (Steel Blue).
- Border/input: `#e5edf5`.
- Ring/fokus: `rgba(0, 83, 119, 0.3)`.
- Tinta interaksi (bg hover): `rgba(0, 83, 119, 0.1)`.
- Dark mode: teks/interaksi foreground gunakan tint terang brand `#5fb4d6` (karena `#005377` terlalu gelap untuk kontras pada latar `#0b111e`).

## Elevasi
- Gunakan dual-layer Stripe shadow: `--shadow-md-stripe`, `--shadow-lg-stripe`, `--shadow-xl-stripe`. Jangan membuat shadow kustom baru.

## Klasifikasi kelas `neu-*`
- Nama kelas `neu-*` dipertahankan (untuk meminimalkan diff), tetapi **visualnya diupdate agar flat/Stripe**:
  - fill padat (bukan gradient/neumorfis),
  - border 1px `#E5EDF5`,
  - dual-layer shadow,
  - interaksi berwarna brand `#005377`,
  - **dilarang gradient chrome** (contoh dilarang: `linear-gradient(135deg, #0073e6, #005377)` pada `.neu-icon`).

## Dark mode
- Semua warna teks/garis fokus/tautan di `.dark` harus cukup kontras (≥ AA) terhadap latar `#0b111e`. Gunakan `#5fb4d6` untuk foreground brand di dark mode.

## Larangan
- Jangan menambahkan token warna, font, atau shadow baru tanpa memperbarui `Design.md` dan aturan ini.
- Jangan menambahkan gradient biru→ungu (cyan chrome) di mana pun.
