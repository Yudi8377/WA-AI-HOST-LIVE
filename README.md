# WA AI HOST LIVE

Universal Commerce AI & Customer Engagement Platform — satu pusat kendali untuk membantu penjual memahami pelanggan, menjawab pertanyaan, dan mengelola percakapan lintas kanal.

> Status: Foundation / simulator stage. Ini bukan pernyataan bahwa koneksi WhatsApp, TikTok, Facebook, Shopee LIVE, pembayaran, atau deployment produksi telah aktif.

## Prinsip proyek
- Source code dan version control: GitHub.
- Database utama: Neon PostgreSQL.
- Kanal eksternal: hanya melalui API resmi, izin yang disetujui, dan kemampuan yang benar-benar tersedia.
- Rp0-first: kembangkan simulator lokal dan fondasi terlebih dahulu; layanan eksternal berbayar hanya diaktifkan setelah keputusan eksplisit.
- Multi-tenant dari awal; tenant isolation, audit trail, validasi input, dan persetujuan untuk aksi berisiko.
- Jangan menggunakan scraping sesi privat, bypass API, atau mengklaim akses LIVE yang tidak tersedia.

## Mulai lokal
1. Gunakan Node.js 20.9+.
2. Salin .env.example menjadi .env.local.
3. Isi DATABASE_URL dari Neon hanya di environment lokal/deployment, jangan commit rahasia.
4. Instal dependensi dengan npm install.
5. Jalankan npm run dev lalu buka http://localhost:3000.

Dashboard sekarang memakai data simulasi agar UI dapat dievaluasi tanpa biaya API. Integrasi database dan kanal akan diaktifkan bertahap setelah konfigurasi aman tersedia.

## Dokumen utama
- docs/MASTER-BLUEPRINT.md
- docs/ARCHITECTURE.md
- docs/OPEN-SOURCE-REVIEW.md
- docs/NEON-DATABASE.md
- docs/SECURITY.md
- docs/ROADMAP.md
- DESIGN.md

## Kanal dan batasan
Urutan implementasi: simulator → core tenant/inbox → WhatsApp Business Platform → evaluasi akses Shopee LIVE → TikTok/Facebook dan kanal lain. Setiap adapter memiliki status kapabilitas. Jika platform tidak menyediakan akses komentar LIVE yang dibutuhkan, gunakan mode Live Host Copilot dengan input manual/stream yang diizinkan; jangan menyamarkan keterbatasan API.

## Quality gates
GitHub Actions memeriksa lint/typecheck/build. Pemeriksaan itu bukan pengganti uji browser, security review, uji webhook, atau verifikasi izin platform. Jangan menyimpan token/API key di source code atau issue publik.


## Deployment status (2026-10-14)

- The dashboard builds as a static Next.js export for GitHub Pages.
- A self-contained dashboard preview is deployed on Neon Functions: https://br-quiet-lake-b3f99jd3-dashboard.compute.c-4.ap-southeast-1.aws.neon.tech/ . It is a live interactive prototype using synthetic data; it does not send or receive real customer messages.
- GitHub Actions quality checks passed on commit `8d3254683908d3d31b77153b4dbde9b07720b2b3`. Static build artifact generation succeeds. GitHub Pages site creation was attempted but GitHub rejected the action with `Resource not accessible by integration`; a repository admin must enable **Settings → Pages → Build and deployment → GitHub Actions** to publish the Next.js static export there.
- A development-only Neon Function health endpoint is deployed at [WA AI HOST LIVE health](https://br-quiet-lake-b3f99jd3-health.compute.c-4.ap-southeast-1.aws.neon.tech/). It reports service health only; it does not mean messaging channels are connected.
- Neon Managed Better Auth is enabled on the development branch only. Production/default branch has not been migrated or connected to application traffic.
- Neon development branch: `wa-ai-host-live-dev`. Do not place production data or real customer information in it.
