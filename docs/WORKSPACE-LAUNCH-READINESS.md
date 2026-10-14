# Kotak Masuk & Layanan Pelanggan — Gerbang Kesiapan Peluncuran

Status: **UI simulator ditingkatkan; belum siap menerima pelanggan nyata**  
Rute produk: `/workspace/`  
PR pekerjaan ini: [#16](https://github.com/Yudi8377/WA-AI-HOST-LIVE/pull/16)

## Perubahan UX dalam PR #16

- Pencarian percakapan dan filter status, termasuk filter belum dibaca.
- Membuka percakapan menandainya telah dibaca.
- Status percakapan dapat diubah dalam simulator: AI menangani, butuh tinjauan, dialihkan ke tim, dan selesai.
- Navigasi seluler dapat dibuka dan ditutup melalui tombol berlabel aksesibel dan backdrop.
- CI memeriksa kontrak keselamatan/UX agar label simulator dan noindex tidak hilang secara tidak sengaja.
- Balasan tetap lokal di simulator. Tidak ada pesan WhatsApp, Instagram, Facebook, atau marketplace nyata yang dikirim.

## Pemeriksaan otomatis

Workflow Quality checks menjalankan:
1. Audit dependensi produksi.
2. Pemeriksaan migrasi keamanan tenant.
3. Tes keamanan jaringan AI agent.
4. Tes kontrak health function.
5. Pemeriksaan keselamatan dan UX workspace.
6. Typecheck TypeScript.
7. ESLint.
8. Build Next.js.

Pemeriksaan kontrak UI bukan pengganti pengujian browser end-to-end atau penetration test.

## Pengujian manual wajib sebelum pilot

- [ ] Desktop: pencarian, filter, ganti percakapan, balasan kosong/valid, saran AI, ubah status.
- [ ] Seluler 320/375/390/430 px: buka/tutup navigasi, backdrop, scroll, komposer tidak terpotong.
- [ ] Keyboard: tab order, fokus terlihat, tombol bisa diaktifkan tanpa mouse, label input terbaca pembaca layar.
- [ ] Aksesibilitas: kontras teks/status, zoom 200%, reduced motion.
- [ ] Kinerja: muat awal dan navigasi pada koneksi lambat, tidak ada error konsol.
- [ ] Keamanan: sesi tanpa login ditolak; user lintas tenant tidak dapat membaca atau mengubah percakapan.
- [ ] Privasi: data contoh jelas ditandai; log tidak menyimpan token atau payload sensitif; ada kebijakan retensi/penghapusan.
- [ ] Kegagalan: API timeout, koneksi terputus, webhook duplikat, retry, idempotensi, dan rate limiting.
- [ ] Kanal: satu konektor resmi harus lulus inbound, balasan outbound, signature webhook, retry, dan uji opt-in/out sebelum ditawarkan sebagai aktif.

## Penghalang produksi yang terverifikasi

1. `GET /api/v1/conversations` masih placeholder `RUNTIME_API_NOT_CONFIGURED`; belum ada API percakapan/pesan terlindungi.
2. Runtime Next.js customer-facing belum terpasang/terverifikasi. Frontend GitHub Pages bersifat static export dan tidak dapat menjalankan API server yang diperlukan.
3. Workspace saat ini tidak memiliki autentikasi/sesi yang mengikat pengguna ke tenant pada UI.
4. Neon perlu role runtime khusus dengan hak minimum, tanpa `BYPASSRLS`; jangan gunakan role owner untuk permintaan pelanggan.
5. Belum ada kanal pesan resmi yang lulus uji end-to-end dan terhubung pada workspace.
6. Belum ada bukti pengujian browser lintas perangkat, pengujian beban, pemulihan backup, monitoring/alert, atau penetration test untuk workspace produksi.

## Gerbang rilis

**Jangan aktifkan kirim pesan nyata atau mengundang pelanggan berbayar** sebelum autentikasi dan otorisasi tenant, API runtime, secret management, kanal resmi, observabilitas, dan tes end-to-end lulus. Jangan menghapus label simulator/noindex sebelum penghalang tersebut ditutup.

Peluncuran bertahap yang disarankan:
1. Demo publik tanpa data pelanggan nyata.
2. Pilot privat untuk satu tenant dan satu kanal resmi.
3. Uji isolasi tenant, keamanan webhook, retry/idempotensi, dan prosedur rollback.
4. Pilot berbayar terbatas setelah pemilik produk menyetujui hasil uji.
5. Peluncuran umum setelah monitoring, dukungan, privasi, dan pemulihan insiden siap.
