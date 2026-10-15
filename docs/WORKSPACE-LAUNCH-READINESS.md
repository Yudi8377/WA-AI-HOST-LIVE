# Kotak Masuk & Layanan Pelanggan — Gerbang Kesiapan Peluncuran

Status: **demo publik terpublikasi; belum siap menerima pelanggan nyata**  
Rute produk: `/workspace/`

## Status terbaru — 15 Oktober 2026

- PR #25 (triase kategori/prioritas) dan PR #26 (preflight runtime aman) telah digabungkan ke `main`.
- Quality checks PR #26: **lulus**, termasuk audit dependensi produksi, kontrak keamanan webhook, self-test preflight, tes pengetahuan/triase, typecheck, lint, dan build.
- Workflow paket ZIP Aptinusa PR #26: **lulus**.
- Ini memvalidasi pipeline dan kontrak otomatis, bukan bukti bahwa situs HTTP publik, koneksi WhatsApp, atau runtime backend sudah berfungsi end-to-end.

## Penghalang produksi yang terverifikasi

1. `GET /api/v1/conversations` masih placeholder `RUNTIME_API_NOT_CONFIGURED`; belum ada API percakapan/pesan terlindungi.
2. Frontend GitHub Pages bersifat static export dan tidak menjalankan handler Node untuk webhook. Deployment Node-capable untuk API belum terverifikasi.
3. Workspace belum mengikat sesi autentikasi ke identitas pengguna dan tenant untuk seluruh operasi percakapan.
4. Neon production memiliki skema percakapan dan RLS, tetapi **role login `wa_webhook_runtime` saat diperiksa menjadi anggota `neon_superuser`, dengan `rolbypassrls=true`, `rolcreaterole=true`, dan `rolcreatedb=true`**. Ini melanggar prinsip hak minimum dan merupakan penghalang keamanan kritis. Jangan gunakan role ini untuk runtime sampai keanggotaan dan atributnya diperbaiki oleh pemilik role/administrator Neon yang berwenang, lalu diverifikasi ulang.
5. Role `wa_app_runtime_safe` pada production terdeteksi `NOLOGIN`, `NOBYPASSRLS`, `NOCREATEROLE`, dan `NOCREATEDB`; semua tabel tenant pada skema public yang diperiksa memiliki RLS, mayoritas dengan FORCE RLS. Namun ini **tidak menghapus risiko** dari login role yang berhak melewati RLS sebelum berpindah role.
6. Kanal WhatsApp resmi belum lulus uji end-to-end dan webhook masih harus tetap nonaktif.
7. Belum ada bukti pengujian browser lintas perangkat, pengujian beban, pemulihan backup, monitoring/alert, atau penetration test untuk workspace produksi.

## Langkah keamanan database sebelum runtime

- [ ] Dengan akun admin Neon yang memiliki kewenangan yang diperlukan, hapus keanggotaan `neon_superuser` dari `wa_webhook_runtime`.
- [ ] Pastikan login role menjadi `NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE`; beri hanya kemampuan minimum untuk berpindah ke `wa_app_runtime_safe` bila arsitektur runtime memerlukannya.
- [ ] Pastikan role login tidak dapat mengubah membership atau mengambil hak yang lebih tinggi.
- [ ] Ulangi pemeriksaan `pg_roles` dan `pg_auth_members` di production dan development.
- [ ] Jalankan tes isolasi tenant menggunakan role efektif yang sama dengan aplikasi; tanpa konteks tenant harus tidak melihat data pelanggan.
- [ ] Pertahankan `WHATSAPP_WEBHOOK_ENABLED=false` sampai semua tes dan deployment selesai.

Percobaan perubahan membership melalui koneksi Neon yang tersedia ditolak karena hak istimewa tidak mencukupi. Tidak ada perubahan role yang dilakukan. Jangan menyamarkan penghalang ini sebagai selesai.

## Pengujian wajib sebelum pilot

- [ ] Desktop dan seluler: pencarian, filter, ganti percakapan, komposer, navigasi, dan status.
- [ ] Keyboard dan aksesibilitas: tab order, fokus terlihat, kontras, zoom 200%, reduced motion.
- [ ] Keamanan: sesi tanpa login ditolak; pengguna lintas tenant tidak dapat membaca atau mengubah percakapan.
- [ ] Privasi: data contoh jelas ditandai; log tidak menyimpan token atau payload sensitif; kebijakan retensi/penghapusan tersedia.
- [ ] Kegagalan: API timeout, webhook duplikat, retry, idempotensi, rate limiting, dan rollback.
- [ ] Kanal: inbound, outbound, signature webhook, delivery status, dan opt-in/out lulus.

## Gerbang rilis

**Jangan aktifkan kirim pesan nyata, menerima data pelanggan, atau mengundang pelanggan berbayar** sebelum role database diperbaiki, API runtime dan autentikasi tenant aktif, secret management tersedia, kanal resmi lulus end-to-end, dan observabilitas/rollback siap.

Tahapan: (1) demo publik tanpa data pelanggan nyata; (2) pilot privat satu tenant/satu kanal; (3) uji isolasi, keamanan webhook, retry/idempotensi, dan rollback; (4) pilot berbayar terbatas setelah hasil uji disetujui; (5) peluncuran umum setelah dukungan, privasi, monitoring, dan pemulihan insiden siap.
