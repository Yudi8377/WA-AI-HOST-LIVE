import { ArrowRightLeft, Plug, ShieldCheck, ShoppingCart, Workflow, Globe2, Store, MessagesSquare, CircleCheck, Clock3 } from "lucide-react";
import { PortalShell, SectionHeading, FeatureCard } from "../components/PortalShell";
import ConnectorDirectory from "./ConnectorDirectory";

export const metadata = {
  title: "Katalog Integrasi Marketplace | Aptinusa",
  description: "Katalog target konektor marketplace, toko online, kanal sosial, dan API resmi Aptinusa beserta status kesiapan integrasinya.",
};

type Connector = { name: string; category: string; scope: string; access: string; status: "Perencanaan" | "Perlu persetujuan" | "Fondasi tersedia"; };
const connectors: Connector[] = [
  {name:"Shopee Open Platform",category:"Asia Tenggara",scope:"Produk, stok, pesanan, pengiriman, dan layanan pelanggan sesuai cakupan API",access:"Akun developer/partner, otorisasi penjual, izin dan uji endpoint",status:"Perlu persetujuan"},
  {name:"Tokopedia",category:"Indonesia",scope:"Katalog dan operasional penjual sesuai akses yang tersedia",access:"Verifikasi jalur integrasi dan kebijakan API yang berlaku",status:"Perlu persetujuan"},
  {name:"TikTok Shop",category:"Asia Tenggara & global",scope:"Produk, promosi, pesanan, pemenuhan, retur, analitik, dan layanan pelanggan sesuai izin",access:"Aplikasi/partner TikTok Shop, otorisasi seller, cakupan dan wilayah yang disetujui",status:"Perlu persetujuan"},
  {name:"Lazada Open Platform",category:"Asia Tenggara",scope:"Produk, pesanan, pemasaran, keuangan, gudang, retur dan pemenuhan",access:"Registrasi aplikasi, kategori API yang disetujui dan otorisasi penjual",status:"Perlu persetujuan"},
  {name:"Blibli",category:"Indonesia",scope:"Katalog, pesanan, stok, dan operasional seller bila API tersedia untuk akun",access:"Validasi program partner dan dokumentasi API resmi",status:"Perencanaan"},
  {name:"Bukalapak",category:"Indonesia",scope:"Konektor historis/layanan yang masih tersedia harus diverifikasi sebelum dibangun",access:"Periksa status produk marketplace dan API saat implementasi",status:"Perencanaan"},
  {name:"Zalora",category:"Asia Tenggara",scope:"Katalog dan pesanan untuk mitra yang memenuhi syarat",access:"Akses mitra dan dokumentasi resmi diperlukan",status:"Perencanaan"},
  {name:"Amazon Selling Partner API",category:"Global",scope:"Listing, stok, pesanan, pengiriman, pembayaran, dan harga sesuai peran",access:"Registrasi aplikasi, otorisasi seller/vendor, wilayah dan scope yang disetujui",status:"Perlu persetujuan"},
  {name:"eBay Sell APIs",category:"Global",scope:"Listing, inventaris, pesanan, pemenuhan dan promosi sesuai izin",access:"Aplikasi developer, OAuth dan scope yang disetujui",status:"Perlu persetujuan"},
  {name:"Etsy Open API",category:"Global",scope:"Listing, inventaris dan pesanan sesuai akses yang diizinkan",access:"Registrasi aplikasi, OAuth dan persetujuan API yang diperlukan",status:"Perlu persetujuan"},
  {name:"Walmart Marketplace APIs",category:"Amerika Utara & pasar terpilih",scope:"Produk, inventaris, pesanan, harga, promosi dan laporan",access:"Kelayakan seller/solution provider, kredensial dan OAuth",status:"Perlu persetujuan"},
  {name:"AliExpress",category:"Global",scope:"Produk dan pesanan sesuai program partner yang tersedia",access:"Validasi akses partner dan API resmi",status:"Perencanaan"},
  {name:"Temu",category:"Global",scope:"Operasional seller sesuai program integrasi yang tersedia",access:"Validasi kelayakan akun, program partner dan API resmi",status:"Perencanaan"},
  {name:"Mercado Libre",category:"Amerika Latin",scope:"Listing, stok, pesanan, pengiriman dan pesan sesuai API",access:"Aplikasi developer, OAuth dan izin penjual",status:"Perlu persetujuan"},
  {name:"Rakuten",category:"Jepang & pasar terpilih",scope:"Katalog dan pemrosesan pesanan sesuai layanan API yang tersedia",access:"Validasi pasar, akun merchant dan API resmi",status:"Perencanaan"},
  {name:"Target Plus",category:"Amerika Serikat",scope:"Listing dan pesanan untuk mitra yang memenuhi syarat",access:"Program partner terbatas dan persetujuan akses",status:"Perencanaan"},
  {name:"Shopify Admin API",category:"Platform toko online",scope:"Produk, inventaris, pesanan, pelanggan dan webhook sesuai scope",access:"Aplikasi terdaftar dan OAuth toko",status:"Perlu persetujuan"},
  {name:"WooCommerce REST API",category:"Platform toko online",scope:"Produk, stok, pesanan, pelanggan dan webhook",access:"Kunci API toko milik pelanggan dengan izin minimum",status:"Perencanaan"},
  {name:"Adobe Commerce / Magento",category:"Platform toko online",scope:"Katalog, inventaris, pesanan, pelanggan dan integrasi ERP",access:"Integrasi API/token milik toko dan pengujian versi",status:"Perencanaan"},
  {name:"BigCommerce",category:"Platform toko online",scope:"Katalog, pesanan, pelanggan, stok dan webhook",access:"Aplikasi/token dan scope toko yang disetujui",status:"Perencanaan"},
  {name:"Wix Stores",category:"Platform toko online",scope:"Produk, pesanan, inventaris sesuai API yang tersedia",access:"Aplikasi Wix dan izin pemilik toko",status:"Perencanaan"},
  {name:"PrestaShop",category:"Platform toko online",scope:"Katalog, pesanan dan stok melalui API/webservice yang dikonfigurasi",access:"Akses toko pelanggan dan pembatasan hak API",status:"Perencanaan"},
  {name:"Facebook & Instagram Shops",category:"Social commerce",scope:"Katalog, event dan pesan sesuai produk Meta yang diizinkan",access:"Meta app review, aset bisnis, izin dan webhook",status:"Perlu persetujuan"},
  {name:"Pinterest Catalogs",category:"Social commerce",scope:"Katalog dan data produk sesuai API",access:"Aplikasi, akun bisnis dan izin yang disetujui",status:"Perencanaan"},
  {name:"Google Merchant Center",category:"Perdagangan & penemuan produk",scope:"Feed produk, status item dan data merchant sesuai API",access:"Akun Merchant Center dan API access",status:"Perencanaan"},
  {name:"WhatsApp Business Platform",category:"Pesan pelanggan",scope:"Pesan bisnis, template yang disetujui, status pengiriman dan webhook",access:"Aplikasi Meta, nomor bisnis, izin dan verifikasi webhook",status:"Perlu persetujuan"},
  {name:"TikTok Business Messaging",category:"Pesan pelanggan",scope:"Pesan bisnis jika produk dan wilayah memenuhi syarat; terpisah dari TikTok Shop",access:"Akses produk bisnis, izin dan kelayakan wilayah",status:"Perencanaan"},
  {name:"Email & web chat",category:"Pesan pelanggan",scope:"Kotak masuk, notifikasi berizin dan pengalihan ke petugas",access:"Penyedia email/chat, persetujuan, kontrol spam dan audit",status:"Perencanaan"},
];

const capabilityGroups = [
  {title:"Katalog & listing",copy:"Pemetaan SKU, variasi, harga, deskripsi, media, validasi atribut, serta publikasi sesuai kemampuan API."},
  {title:"Stok & pesanan",copy:"Sinkronisasi stok, impor pesanan, status pemenuhan, pembatalan dan retur bila didukung; gunakan idempotensi dan rekonsiliasi."},
  {title:"Percakapan & layanan",copy:"Satukan kanal pesan yang secara resmi menyediakan akses; AI memberi saran, dengan pengalihan ke manusia dan aturan persetujuan."},
  {title:"Analitik & agen AI",copy:"Normalisasi metrik lintas kanal, deteksi anomali, rekomendasi konten, dan pemantauan perubahan API—bukan klaim bahwa AI dapat mengubah algoritma platform."},
];

function statusLabel(status: Connector["status"]) {
  if (status === "Perlu persetujuan") return "Menunggu akses resmi";
  if (status === "Fondasi tersedia") return "Fondasi tersedia";
  return "Dalam perencanaan";
}

export default function Connectors() {
  const groups = [...new Set(connectors.map((c) => c.category))];
  return <PortalShell active="/connectors/">
    <SectionHeading eyebrow="KATALOG INTEGRASI" title="Satu ruang kendali untuk banyak kanal." description="Katalog target Aptinusa mencakup marketplace Indonesia, Asia Tenggara, pasar global, toko mandiri, social commerce, dan layanan pesan. Setiap konektor harus melewati otorisasi resmi, pemeriksaan kemampuan API, uji keamanan, dan pengujian ujung ke ujung sebelum dinyatakan aktif."/>
    <div className="apt-notice"><ShieldCheck size={18}/><div><b>Transparansi status dan keamanan</b><p>Daftar ini adalah inventaris cakupan target, bukan pernyataan bahwa semua konektor sudah terhubung. Jangan mengirim kata sandi seller ke Aptinusa; gunakan alur otorisasi resmi. Token disimpan di server, dibatasi per tenant, dan dapat dicabut.</p></div></div>
    <div className="apt-card-grid">
      {[[Plug,"Siklus konektor","Temukan → otorisasi → validasi scope → uji sandbox → aktifkan → pantau → cabut."],[ArrowRightLeft,"Model data terpadu","Ubah event vendor menjadi kontrak internal berversi dengan deduplikasi, idempotensi, retry dan dead-letter queue."],[Workflow,"Pengaman otomatisasi","Terapkan batas tenant, persetujuan manusia, rate limit, pencatatan audit dan perlindungan aksi berdampak." ]].map(([I,title,copy])=>{const Icon=I as typeof Plug;return <FeatureCard key={title as string} icon={<Icon size={21}/>} title={title as string}>{copy as string}</FeatureCard>;})}
    </div>
    <h2 className="apt-section-title">Kemampuan inti lintas kanal</h2>
    <div className="apt-card-grid">{capabilityGroups.map((item)=> <FeatureCard key={item.title} icon={<Workflow size={20}/>} title={item.title}>{item.copy}</FeatureCard>)}</div>
    <h2 className="apt-section-title">Daftar konektor dan kesiapan</h2>
    <p className="apt-section-copy">Total inventaris: <b>{connectors.length} konektor/kelompok integrasi</b> dalam {groups.length} kategori. Status di bawah adalah status perencanaan sampai koneksi resmi benar-benar diuji.</p>
    <ConnectorDirectory connectors={connectors} />
    <h2 className="apt-section-title">Gerbang wajib sebelum konektor dinyatakan aktif</h2>
    <div className="apt-card-grid">
      <FeatureCard icon={<CircleCheck size={20}/>} title="Akses dan izin">Aplikasi disetujui, otorisasi penjual valid, scope minimum, wilayah didukung, serta proses pencabutan teruji.</FeatureCard>
      <FeatureCard icon={<ShieldCheck size={20}/>} title="Keamanan multi-tenant">Rahasia hanya di server, isolasi tenant, pembatasan hak, validasi signature webhook, audit dan pengujian akses lintas tenant.</FeatureCard>
      <FeatureCard icon={<Clock3 size={20}/>} title="Ketahanan operasional">Retry dengan backoff, batas laju, deduplikasi event, rekonsiliasi, pemantauan error dan prosedur pemulihan.</FeatureCard>
    </div>
    <p className="apt-disclaimer">Katalog ini memetakan cakupan target yang luas, tetapi tidak mungkin menjamin “semua marketplace di internet” karena layanan, API, kebijakan, dan akses berubah menurut negara dan jenis akun. Konektor hanya boleh diberi status aktif setelah tes sandbox/produksi yang berizin berhasil. Tidak ada scraping tidak resmi atau klaim koneksi palsu.</p>
  </PortalShell>;
}
