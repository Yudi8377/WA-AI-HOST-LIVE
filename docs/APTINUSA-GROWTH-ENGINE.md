# Aptinusa Growth Engine — Fondasi Produk

Status dokumen: rancangan implementasi, bukan bukti fitur produksi sudah aktif.

## Tujuan

Aptinusa membantu usaha kecil ditemukan, mendapatkan prospek, mengubah prospek menjadi transaksi, dan mendorong pembelian berulang. Produk dibangun sebagai modul pada satu fondasi multi-tenant, bukan aplikasi terpisah per kanal.

## Prinsip wajib

1. **Transparansi status:** bedakan `available`, `beta`, `approval_required`, `planned`, dan `blocked`. Jangan menampilkan kanal sebagai aktif tanpa kredensial resmi dan uji end-to-end yang tercatat.
2. **Privasi tenant:** data profil, katalog, pelanggan, persetujuan, kampanye, dan analitik selalu dibatasi ke tenant yang terautentikasi. Jangan menggunakan data satu tenant untuk mempromosikan tenant lain.
3. **Pemasaran berbasis izin:** catat siapa yang memberi izin, kanal, tujuan, sumber, waktu, dan versi pemberitahuan. Hormati opt-out dan suppression list di semua pengiriman berikutnya.
4. **Persetujuan sebelum biaya/tindakan eksternal:** AI boleh menyiapkan draf dan rekomendasi. Pengiriman kampanye berbayar, perubahan anggaran, dan publikasi otomatis harus mengikuti izin yang eksplisit dan batas tenant.
5. **Tanpa jaminan ranking:** SEO memberi fondasi teknis dan konten berkualitas, bukan jaminan posisi atau jumlah penjualan.
6. **Rp0-first:** mulai dari profil usaha, katalog publik, pemeriksaan SEO lokal, generator konten berbasis kuota, dan simulasi kampanye. Integrasi berbayar hanya setelah provider, biaya, akses, dan pengujian disetujui.
7. **Auditabilitas:** simpan event untuk perubahan persetujuan, pembuatan kampanye, persetujuan, pengiriman, kegagalan, opt-out, dan atribusi konversi.

## Modul produk

| Modul | Ruang lingkup MVP | Status awal |
|---|---|---|
| Profil & katalog publik | Profil usaha, produk, jam, wilayah layanan, tautan kontak | planned |
| SEO dasar | Metadata, canonical, sitemap, robots, data terstruktur yang valid | planned |
| AI Content Studio | Draf deskripsi, judul, FAQ, kalender konten; tinjau sebelum terbit | planned |
| Local SEO Insights | Kata kunci, checklist profil lokal, metrik Search Console jika dihubungkan | approval_required |
| CRM & consent | Kontak yang diberikan secara sah, sumber izin, preferensi kanal, opt-out | planned |
| WhatsApp campaigns | Template, status persetujuan, kuota, log delivery via provider resmi | approval_required |
| SMS campaigns | Provider resmi, estimasi biaya, opt-out, suppression list, delivery receipts | approval_required |
| Email campaigns | Domain/authentication, preference center, bounce/unsubscribe handling | approval_required |
| Loyalty & referral | Kupon, referral, aturan program, pencatatan penukaran | planned |
| Growth analytics | Klik, leads, pesan masuk, order/conversion jika integrasi tersedia | planned |

Status `planned` bukan berarti implementasi tersedia. Status `approval_required` berarti perlu kredensial, keputusan biaya, izin platform/provider, dan pengujian sebelum diaktifkan.

## Model harga awal untuk validasi pasar

Harga berikut adalah usulan, bukan harga yang sudah ditagihkan:

| Paket | Harga usulan/bulan | Batas awal |
|---|---:|---|
| Mikro | Rp99.000 | Satu usaha, profil/katalog, checklist SEO dasar |
| Growth | Rp249.000 | Kuota AI konten, analitik dasar, alur prospek dasar |
| Omnichannel | Rp499.000 | Modul inbox dan kanal yang telah diverifikasi; kuota lebih tinggi |
| Business | Mulai Rp999.000 | Penawaran sesuai jumlah pengguna, kanal, kuota, dan SLA |

Biaya pesan WhatsApp/SMS, iklan, domain premium, dan layanan pihak ketiga ditampilkan terpisah. Jangan mengiklankan integrasi atau batas paket yang belum didukung oleh runtime. Paket dapat diubah setelah uji willingness-to-pay dan perhitungan biaya AI, provider, dukungan, pajak, dan infrastruktur.

## Alur pemasaran yang aman

1. Usaha membuat profil dan mengonfirmasi bahwa ia berhak mengelola informasi tersebut.
2. Aptinusa membuat draf halaman/konten; pemilik usaha meninjau dan menyetujui sebelum publikasi.
3. Kontak konsumen masuk hanya melalui sumber yang sah. Catat izin terpisah per kanal dan tujuan.
4. Kampanye diuji pada mode simulasi terlebih dahulu. Sebelum pengiriman, cek izin kanal, template, suppression list, kuota, perkiraan biaya, dan persetujuan operator.
5. Setelah provider mengirim, catat hasil provider. Jangan menyamakan status queued/sent dengan delivered atau conversion.
6. Ukur klik dan transaksi hanya melalui integrasi yang tersedia serta dengan pemberitahuan privasi yang sesuai.

## Data model minimum yang perlu dirancang

- `business_profiles`: tenant_id, nama publik, kategori, lokasi/wilayah, deskripsi, status publikasi.
- `catalog_items`: tenant_id, business_profile_id, nama, deskripsi, harga opsional, stok opsional, status publikasi.
- `marketing_contacts`: tenant_id, kanal, alamat kontak terenkripsi atau terlindungi, sumber, created_at.
- `marketing_consents`: tenant_id, contact_id, channel, purpose, status, captured_at, source, notice_version, revoked_at.
- `suppression_entries`: tenant_id, channel, destination_hash, reason, created_at.
- `campaigns`: tenant_id, channel, status, approved_by, approved_at, estimated_cost, provider_reference.
- `campaign_events`: tenant_id, campaign_id, event_type, provider_event_id, occurred_at, safe_metadata.
- `growth_metrics`: tenant_id, source, period, metric, value, attribution_method.

Nama tabel ini adalah rancangan. Sebelum migrasi, perlu review skema yang sudah ada, foreign keys, tenant isolation, RLS, retensi data, dan cara menangani webhook idempotently. Jangan menyimpan token provider atau isi pesan sensitif pada log umum.

## Gerbang rilis

- [ ] Skema dan RLS diuji untuk akses lintas tenant.
- [ ] Authentication/runtime produksi terverifikasi.
- [ ] Role database least-privilege dan tidak dapat melewati RLS.
- [ ] Opt-out diuji end-to-end dan suppression list selalu diperiksa sebelum kirim.
- [ ] Provider resmi, template, biaya, dan webhook diverifikasi.
- [ ] Browser/device E2E, rate limit, abuse prevention, monitoring, backup/restore, dan incident runbook lulus.
- [ ] Dasbor membedakan simulasi, konfigurasi, approval, dan integrasi live.
- [ ] Harga, kuota, pajak, biaya provider, dan kebijakan privasi disetujui sebelum penjualan.

## Tahapan

1. Katalog modul dan halaman profil/katalog publik tanpa pengiriman pesan.
2. SEO teknis dan AI content draft dengan approval manusia.
3. CRM dengan consent ledger dan opt-out sebelum mengaktifkan campaign.
4. Satu provider messaging resmi di lingkungan staging, lalu pilot privat.
5. Loyalty, atribusi konversi, dan optimasi AI setelah data kualitas cukup.

## Batasan kondisi repositori saat ini

README proyek saat ini menyatakan sistem masih demo/simulator publik, endpoint percakapan produksi belum terkonfigurasi, dan kanal eksternal belum terverifikasi end-to-end. Karena itu Growth Engine ini tidak boleh mengaktifkan kirim pesan nyata atau menerima daftar pelanggan nyata sampai readiness gates di atas lulus.
