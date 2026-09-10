# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Nama Produk:** Work Management System (WMS)  
**Platform:** Web Application (Responsive/Mobile-First untuk Scanner)  
**Tech Stack:** Laravel, Inertia.js, React, MySQL  
**Target Pengguna:** Internal Perusahaan dan Unit Bisnis

---

## 1. Business Process

Sistem ini dirancang untuk mendigitalisasi, menstandarkan, dan mengotomatisasi proses pemeliharaan keamanan (APAR & Hydrant) serta patroli keamanan (Checkpoint).

- **Standarisasi & Validasi:** Penggunaan QR Code memastikan bahwa petugas benar-benar berada di lokasi fisik saat melakukan inspeksi.
- **Akuntabilitas & Kepatuhan:** Sistem menghilangkan _blind-spot_ inspeksi dengan fitur eskalasi otomatis. Jika suatu aset tidak diinspeksi sesuai jadwal, sistem akan menegur penanggung jawab dan menaikkan peringatan tersebut ke manajemen tingkat atas jika tidak ada perbaikan.
- **Tindakan Preventif:** Sistem secara proaktif memperingatkan pengguna mengenai perangkat (seperti APAR) yang mendekati masa kadaluarsa agar dapat segera diganti.

## 2. User Roles

Berdasarkan sistem _Role-Based Access Control_ (RBAC), berikut adalah peran pengguna yang ada dalam sistem:

1.  **Petugas / Inspector:** Pengguna lapangan yang bertugas memindai QR Code dan mengisi form inspeksi.
2.  **Supervisor:** Penanggung jawab area/unit. Memantau jalannya inspeksi harian dan menerima notifikasi peringatan pertama jika ada aset/checkpoint yang terlewat.
3.  **General Manager (GM):** Eksekutif yang memantau rekapitulasi kepatuhan. Menerima notifikasi eskalasi (setelah 3 hari) jika Supervisor dan Petugas gagal menyelesaikan inspeksi yang tertunda.
4.  **Super Administrator:** Mengelola data master (Data APAR, Hydrant, Checkpoint, dan Pengguna) serta mencetak QR Code.

## 3. WorkFlow Roles

Alur kerja sistem dibagi menjadi tiga alur utama:

### Flow Inspeksi (Petugas)

1. Petugas login ke aplikasi via perangkat _mobile_.
2. Mengakses menu "Scan QR" dan memindai barcode/QR pada APAR, Hydrant, atau Checkpoint.
3. Sistem menampilkan form inspeksi spesifik berdasarkan entitas yang di-scan (struktur form merujuk pada file migrasi).
4. Petugas mengisi data kondisi, keterangan, dan foto (jika diperlukan) lalu klik Simpan.
5. Data tersimpan, status aset berubah menjadi "Sudah Diinspeksi" untuk periode tersebut.

### Flow Notifikasi Keterlambatan & Eskalasi (Sistem -> Supervisor -> GM)

1. _Scheduler_ (Cron Job Laravel) berjalan setiap hari untuk mengecek jadwal inspeksi.
2. Jika terdapat aset yang lewat jadwal inspeksinya (belum diinspeksi):
    - **Hari ke-1 & 2:** Sistem mengirim notifikasi via WhatsApp dan In-App WebSocket kepada **Supervisor**.
    - **Hari ke-3:** Jika data tersebut _masih_ belum diinspeksi, sistem menaikkan (_escalate_) peringatan dengan mengirimkan notifikasi kepada **General Manager** dan Supervisor.

### Flow Notifikasi Kadaluarsa (Sistem -> Supervisor/Admin)

1. _Scheduler_ mengecek tanggal kadaluarsa (Expired Date) APAR setiap hari.
2. Jika APAR akan kadaluarsa (misal: H-30 atau H-14), sistem mengirimkan peringatan via WhatsApp dan In-App WebSocket.

## 4. Functional Work

Fitur-fitur fungsional yang harus dibangun di dalam sistem:

- **Modul Manajemen Master Data (CRUD & QR Generator)**
    - **Manajemen APAR:** Tambah, Edit, Hapus, Lihat detail APAR, dan _Generate/Print_ QR Code massal atau satuan.
    - **Manajemen Hydrant:** Tambah, Edit, Hapus, Lihat detail Hydrant, dan _Generate/Print_ QR Code.
    - **Manajemen Checkpoint:** Tambah, Edit, Hapus, Lihat detail lokasi patroli, dan _Generate/Print_ QR Code.
- **Modul Inspeksi Berbasis Scanner**
    - Integrasi pustaka _QR Code Scanner_ pada antarmuka React.
    - Form Inspeksi APAR, Hydrant, dan Checkpoint.
- **Modul Notifikasi (Push & Message)**
    - _Real-time in-app notification_ menggunakan WebSocket.
    - Integrasi pengiriman pesan WhatsApp.
- **Modul RBAC & User Management**
    - Pengelolaan Akun Pengguna, penetapan _Role_, dan _Permissions_.

## 5. Security Requirement

- **Authentication & Session:** Menggunakan perlindungan autentikasi bawaan Laravel (Sanctum/Session) yang terintegrasi dengan Inertia.
- **Integritas QR Code:** Menggunakan UUID v4 atau kode terenkripsi untuk mencegah orang memanipulasi URL inspeksi tanpa memindai fisik.
- **Validasi Data:** Semua form input harus melewati `FormRequest` validation di sisi Laravel dan validasi sisi _client_ di React untuk menghindari _SQL Injection_ dan XSS.
- **Geolocation (Opsional tapi disarankan):** Saat melakukan inspeksi, sistem menangkap koordinat GPS perangkat untuk mencocokkan dengan koordinat master aset mencegah kecurangan.

## 6. Integration Requirement

- **WhatsApp Gateway/API:** Integrasi dengan penyedia layanan pihak ketiga (seperti Fonnte, Watzap, Twilio) untuk mengirim pesan peringatan.
- **WebSocket Server:** Menggunakan **Laravel Reverb** (rekomendasi) atau **Pusher/Soketi** untuk distribusi _event_ notifikasi ke _frontend_ secara _real-time_.
- **Queue System:** Penggunaan Laravel Queue dan Redis sangat diwajibkan untuk _background processing_ pengiriman pesan WA dan WebSocket.

## 7. Infrastructure Architecture

- **Web Server:** Nginx untuk menyajikan aplikasi Laravel dan aset statis hasil _build_ Vite/React.
- **App Server (PHP):** PHP-FPM menjalankan _backend_ Laravel.
- **Database:** MySQL untuk menyimpan seluruh skema migrasi dan data transaksional.
- **Cache & Queue Worker:** Redis sebagai penyimpanan sesi, _cache_, dan _Queue Driver_. Supervisor (Linux) untuk menjaga proses antrean tetap berjalan.
- **WebSocket Server:** Layanan _daemon_ mandiri (Laravel Reverb) dengan _proxy_ wss:// untuk koneksi aman.

## 8. UAT (User Acceptance Testing) & Maintenance

- **Skenario UAT Utama:**
    - **Test Pemindaian:** Petugas men-scan QR, mengisi data, memastikan data masuk ke riwayat inspeksi.
    - **Test RBAC:** Memastikan akses halaman sesuai dengan hak akses (Role).
    - **Test Eskalasi:** Memanipulasi tanggal _server_ untuk memastikan Cron job memicu _event_ notifikasi berjenjang dari Supervisor ke GM.
- **Pemeliharaan (Maintenance):**
    - Pembersihan data log inspeksi berkala (_archiving_).
    - Perawatan fisik QR Code (Label tahan air/cuaca).
    - Pemantauan layanan Queue dan WebSocket menggunakan fitur seperti _Laravel Horizon_.
