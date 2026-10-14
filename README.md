# WA AI HOST LIVE

Universal Commerce AI & Customer Engagement Platform — satu pusat kendali untuk membantu penjual memahami pelanggan, menjawab pertanyaan, dan mengelola percakapan lintas kanal.

> **Status saat ini: demo/simulator publik; belum menjadi layanan pesan pelanggan produksi.** UI workspace telah diperbarui dan workflow GitHub Actions untuk quality checks, build/deploy GitHub Pages, serta paket ZIP berhasil pada commit `1cfd0c4aa770d28a6ab8ad24958407f5a2c20c97`. Keberhasilan build/deploy tidak berarti API pesan, autentikasi produksi, atau kanal eksternal sudah aktif.

## Prinsip proyek
- Source code dan version control: GitHub.
- Database utama: Neon PostgreSQL.
- Kanal eksternal: hanya melalui API resmi, izin yang disetujui, dan kemampuan yang benar-benar tersedia.
- Rp0-first: kembangkan simulator dan fondasi terlebih dahulu; layanan eksternal berbayar hanya diaktifkan setelah keputusan eksplisit.
- Multi-tenant dari awal; tenant isolation, audit trail, validasi input, dan persetujuan untuk aksi berisiko.
- Jangan menggunakan scraping sesi privat, bypass API, atau mengklaim akses LIVE yang tidak tersedia.

## Buka demo
- [Kotak Masuk & Layanan Pelanggan](https://yudi8377.github.io/WA-AI-HOST-LIVE/workspace/)
- [Quality checks](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38589764287)
- [GitHub Pages deploy](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38589764300)
- [Paket ZIP](https://github.com/Yudi8377/WA-AI-HOST-LIVE/actions/runs/38589764656)

Workspace menggunakan data sintetis/lokal. Balasan tidak dikirim ke WhatsApp, Instagram, Facebook, atau marketplace. Jangan masukkan data pribadi pelanggan atau rahasia bisnis ke demo.

## Mulai lokal
1. Gunakan Node.js 20.9+.
2. Salin `.env.example` menjadi `.env.local`.
3. Isi `DATABASE_URL` dari Neon hanya di environment lokal/deployment, jangan commit rahasia.
4. Jalankan `npm install`.
5. Jalankan `npm run dev`, lalu buka http://localhost:3000.

## Dokumen utama
- `docs/MASTER-BLUEPRINT.md`
- `docs/ARCHITECTURE.md`
- `docs/OPEN-SOURCE-REVIEW.md`
- `docs/NEON-DATABASE.md`
- `docs/SECURITY.md`
- `docs/ROADMAP.md`
- `docs/WORKSPACE-LAUNCH-READINESS.md`
- `DESIGN.md`

## Status dan batasan yang harus ditutup sebelum produksi
- `GET /api/v1/conversations` masih mengembalikan `RUNTIME_API_NOT_CONFIGURED`; belum ada API percakapan produksi yang terverifikasi.
- GitHub Pages adalah static frontend dan bukan runtime untuk API server.
- Autentikasi dan otorisasi harus terhubung ke tenant aktif, dengan kebijakan database dan secret management yang aman.
- Belum ada konektor kanal resmi yang terverifikasi end-to-end pada workspace.
- Pengujian browser, keamanan, beban, backup/restore, monitoring/alert, dan penanganan insiden masih harus dibuktikan sebelum pilot pelanggan.

Urutan implementasi: simulator → core tenant/inbox dan API terautentikasi → satu konektor resmi → pilot privat → perluasan kanal. Jika platform tidak menyediakan akses komentar LIVE yang dibutuhkan, gunakan mode Live Host Copilot dengan input manual/stream yang diizinkan; jangan menyamarkan keterbatasan API.

## Quality gates
GitHub Actions menjalankan audit dependensi, pemeriksaan keamanan yang tersedia, typecheck, lint, build, dan kontrak keselamatan workspace. Pemeriksaan otomatis bukan pengganti uji browser end-to-end, penetration test, uji webhook, atau verifikasi izin platform.

**Jangan menerima data pelanggan nyata, menjual akses produksi, atau mengaktifkan kirim pesan nyata sampai semua gerbang dalam `docs/WORKSPACE-LAUNCH-READINESS.md` lulus.**
