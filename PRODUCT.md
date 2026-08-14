# PRODUCT.md — Sistem Manajemen & Inspeksi APAR, Hydrant, dan Checkpoint

**Nama Produk:** Sistem Inspeksi APAR, Hydrant & Checkpoint (kerja: *Safety Inspection System*)
**Platform:** Web Application, responsive / mobile-first (untuk kebutuhan scan di lapangan)
**Tech Stack:** Laravel, Inertia.js, React, MySQL
**Target Pengguna:** Internal perusahaan / unit bisnis pengelola gedung (mall)

---

## 1. Ringkasan Produk

Produk ini mendigitalisasi dan menstandarkan dua proses keselamatan fisik yang selama ini rawan diselewengkan atau terlewat secara manual:

1. **Pemeliharaan keamanan** — inspeksi berkala APAR (alat pemadam api ringan) dan hydrant.
2. **Patroli keamanan** — inspeksi checkpoint di area mall.

Inti dari sistem ini adalah **validasi lokasi via QR Code** (memastikan petugas benar-benar hadir secara fisik saat inspeksi) dan **eskalasi otomatis** (menghilangkan blind-spot ketika inspeksi terlewat), ditambah **peringatan preventif** untuk APAR yang mendekati masa kadaluarsa.

## 2. Masalah yang Diselesaikan

- Tidak ada cara memverifikasi apakah inspeksi benar-benar dilakukan di lokasi fisik, atau hanya dicatat di atas kertas.
- Aset/checkpoint yang terlewat inspeksinya tidak terdeteksi sampai terlambat — tidak ada mekanisme tegur otomatis.
- APAR yang kadaluarsa baru diketahui setelah lewat masa berlaku, bukan sebelum, sehingga penggantian jadi reaktif bukan preventif.

## 3. Tujuan Produk

- Standarisasi proses inspeksi APAR, Hydrant, dan Checkpoint melalui satu sistem digital.
- Menjamin akuntabilitas lewat jejak audit (siapa, kapan, di mana) dan eskalasi berjenjang saat SLA inspeksi dilanggar.
- Memberi peringatan dini sebelum APAR kadaluarsa agar penggantian bisa direncanakan.

## 4. User Roles (RBAC)

| Role | Deskripsi |
|---|---|
| **Petugas / Inspector** | Pengguna lapangan — scan QR Code dan mengisi form inspeksi. |
| **Supervisor** | Penanggung jawab area/unit — memantau inspeksi harian, penerima notifikasi peringatan tahap pertama (hari 1-2). |
| **General Manager (GM)** | Memantau rekap kepatuhan tingkat atas — menerima notifikasi eskalasi (hari ke-3) jika Supervisor & Petugas belum menindaklanjuti. |
| **Super Administrator** | Mengelola data master (APAR, Hydrant, Checkpoint, User) dan mencetak QR Code. |

## 5. Alur Kerja Utama

### 5.1 Flow Inspeksi (Petugas)
1. Login via perangkat mobile.
2. Buka menu "Scan QR", pindai barcode/QR pada APAR / Hydrant / Checkpoint.
3. Sistem menampilkan form inspeksi sesuai jenis entitas yang di-scan.
4. Petugas mengisi kondisi, keterangan, dan foto (jika perlu), lalu simpan.
5. Status aset berubah menjadi "Sudah Diinspeksi" untuk periode berjalan.

### 5.2 Flow Eskalasi Keterlambatan (Sistem → Supervisor → GM)
1. Scheduler (Cron Laravel) mengecek jadwal inspeksi setiap hari.
2. **Hari 1-2 terlewat:** notifikasi WhatsApp + in-app WebSocket ke **Supervisor**.
3. **Hari ke-3 masih belum diinspeksi:** eskalasi — notifikasi dikirim ke **General Manager** dan Supervisor.

### 5.3 Flow Peringatan Kadaluarsa (Sistem → Supervisor/Admin)
1. Scheduler mengecek Expired Date APAR setiap hari.
2. Pada ambang tertentu (mis. H-30, H-14), sistem mengirim peringatan WhatsApp + in-app WebSocket.

## 6. Fitur Utama (Functional Scope)

**Manajemen Master Data (CRUD + QR Generator)**
- Manajemen APAR: CRUD, detail, generate/print QR (satuan & massal)
- Manajemen Hydrant: CRUD, detail, generate/print QR
- Manajemen Checkpoint: CRUD lokasi patroli, generate/print QR

**Inspeksi Berbasis Scanner**
- Integrasi QR Code Scanner di antarmuka React
- Form inspeksi terpisah untuk APAR, Hydrant, dan Checkpoint

**Notifikasi (Push & Message)**
- Real-time in-app notification via WebSocket
- Integrasi pengiriman pesan WhatsApp

**RBAC & User Management**
- Pengelolaan akun, penetapan role, dan permission

## 7. Non-Functional Requirements

### Keamanan
- Autentikasi & sesi via Laravel (Sanctum/Session), terintegrasi Inertia.
- Integritas QR Code memakai UUID v4 / kode terenkripsi — mencegah manipulasi URL inspeksi tanpa scan fisik.
- Validasi input di dua sisi: `FormRequest` (Laravel) + validasi client (React) untuk mencegah SQL Injection & XSS.
- Geolocation (opsional, disarankan): menangkap koordinat GPS saat inspeksi untuk dicocokkan dengan koordinat master aset, mencegah kecurangan.

### Integrasi
- WhatsApp Gateway pihak ketiga (mis. Fonnte, Watzap, Twilio).
- WebSocket server: Laravel Reverb (rekomendasi) atau Pusher/Soketi.
- Laravel Queue + Redis wajib untuk background processing pengiriman WA & WebSocket.

### Arsitektur Infrastruktur
- **Web server:** Nginx (serve Laravel + hasil build Vite/React)
- **App server:** PHP-FPM
- **Database:** MySQL
- **Cache & Queue:** Redis, dijaga oleh Supervisor (Linux)
- **WebSocket:** Laravel Reverb sebagai daemon mandiri, proxy wss://

## 8. UAT & Maintenance

**Skenario UAT utama**
- Test pemindaian: scan QR → isi data → data masuk riwayat inspeksi.
- Test RBAC: akses halaman sesuai hak akses role.
- Test eskalasi: manipulasi tanggal server untuk memastikan cron memicu notifikasi berjenjang Supervisor → GM.

**Maintenance**
- Archiving log inspeksi berkala.
- Perawatan fisik label QR Code (tahan air/cuaca).
- Pemantauan Queue & WebSocket via Laravel Horizon.

## 9. Out of Scope (belum ditentukan di PRD ini)

Item berikut tidak disebutkan di PRD sumber — perlu diklarifikasi terpisah bila relevan: integrasi ERP/HRIS, aplikasi mobile native, sistem pelaporan/dashboard analitik, multi-tenant, dan manajemen inventori suku cadang APAR/Hydrant.
