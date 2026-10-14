# Kotak Masuk & Layanan Pelanggan — Gerbang Kesiapan Peluncuran

Status: **demo publik terpublikasi; belum siap menerima pelanggan nyata**  
Rute produk: `/workspace/`  
PR UX: [#16](https://github.com/Yudi8377/WA-AI-HOST-LIVE/pull/16)

## Status terbaru — 14 Oktober 2026

- Commit `1cfd0c4aa770d28a6ab8ad24958407f5a2c20c97` ada di `main`.
- Workflow Quality Checks [#134](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38589764287): sukses.
- Workflow Deploy GitHub Pages [#40](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38589764300): job build dan deploy sukses.
- Workflow Build Aptinusa delivery ZIPs [#43](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38589764656): sukses.
- Ini membuktikan pipeline build/deploy, bukan penerimaan pesan eksternal atau kesiapan operasional produksi. Pemeriksaan HTTP langsung dari lingkungan kerja ini tidak tersedia, sehingga jangan menganggap status HTTP situs sudah diverifikasi hanya dari workflow.

## Perubahan UX dalam PR #16

- Pencarian percakapan dan filter status, termasuk filter belum dibaca.
- Membuka percakapan menandainya telah dibaca.
- Status percakapan dapat diubah dalam simulator: AI menangani, butuh tinjauan, dialihkan ke tim, dan selesai.
- Navigasi seluler dapat dibuka dan ditutup melalui tombol berlabel aksesibel dan backdrop.
- CI memeriksa kontrak keselamatan/UX agar label simulator dan noindex tidak hilang secara tidak sengaja.
- Balasan tetap lokal di simulator. Tidak ada pesan WhatsApp, Instagram, Facebook, atau marketplace nyata yang dikirim.

## Pemeriksaan otomatis

Workflow Quality Checks menjalankan audit dependensi produksi, pemeriksaan migrasi keamanan tenant, tes keamanan jaringan AI agent, tes kontrak health function, pemeriksaan keselamatan dan UX workspace, typecheck TypeScript, ESLint, dan build Next.js.

Pemeriksaan kontrak UI bukan pengganti pengujian browser end-to-end atau penetration test.

## Penghalang produksi yang terverifikasi

1. `GET /api/v1/conversations` masih placeholder `RUNTIME_API_NOT_CONFIGURED`; belum ada API percakapan/pesan terlindungi.
2. Runtime Next.js customer-facing belum terpasang/terverifikasi. Frontend GitHub Pages bersifat static export dan tidak dapat menjalankan API server yang diperlukan.
3. Workspace belum mengikat sesi autentikasi ke identitas pengguna dan tenant untuk seluruh operasi percakapan.
4. Konfigurasi autentikasi produksi masih perlu hardening dan uji verifikasi email/flow akun sebelum pendaftaran pelanggan dibuka.
5. Neon perlu role runtime khusus dengan hak minimum, tanpa `BYPASSRLS`; jangan gunakan role owner untuk permintaan pelanggan.
6. Belum ada kanal pesan resmi yang lulus uji end-to-end dan terhubung pada workspace.
7. Belum ada bukti pengujian browser lintas perangkat, pengujian beban, pemulihan backup, monitoring/alert, atau penetration test untuk workspace produksi.

## Pengujian wajib sebelum pilot

- [ ] Desktop: pencarian, filter, ganti percakapan, balasan kosong/valid, saran AI, ubah status.
- [ ] Seluler 320/375/390/430 px: buka/tutup navigasi, backdrop, scroll, komposer tidak terpotong.
- [ ] Keyboard: tab order, fokus terlihat, tombol dapat diaktifkan tanpa mouse, label input terbaca pembaca layar.
- [ ] Aksesibilitas: kontras teks/status, zoom 200%, reduced motion.
- [ ] Kinerja: muat awal dan navigasi pada koneksi lambat, tidak ada error konsol.
- [ ] Keamanan: sesi tanpa login ditolak; user lintas tenant tidak dapat membaca atau mengubah percakapan.
- [ ] Privasi: data contoh jelas ditandai; log tidak menyimpan token atau payload sensitif; ada kebijakan retensi/penghapusan.
- [ ] Kegagalan: API timeout, koneksi terputus, webhook duplikat, retry, idempotensi, dan rate limiting.
- [ ] Kanal: konektor resmi lulus inbound, balasan outbound, signature webhook, retry, dan uji opt-in/out.

## Gerbang rilis

**Jangan aktifkan kirim pesan nyata, menerima data pelanggan, atau mengundang pelanggan berbayar** sebelum autentikasi dan otorisasi tenant, API runtime, secret management, kanal resmi, observabilitas, dan tes end-to-end lulus. Jangan menghapus label simulator/noindex sebelum penghalang tersebut ditutup.

Peluncuran bertahap: (1) demo publik tanpa data pelanggan nyata; (2) pilot privat satu tenant/satu kanal resmi; (3) uji isolasi tenant, keamanan webhook, retry/idempotensi, dan rollback; (4) pilot berbayar terbatas setelah hasil uji disetujui; (5) peluncuran umum setelah monitoring, dukungan, privasi, dan pemulihan insiden siap.
