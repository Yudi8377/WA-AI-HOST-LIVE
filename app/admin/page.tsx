import Link from "next/link";
import { Activity, ArrowUpRight, BadgeCheck, Bot, CircleDashed, CreditCard, Gauge, LifeBuoy, LockKeyhole, Search, ShieldCheck, Users, WalletCards, Workflow } from "lucide-react";
import { PortalShell } from "../components/PortalShell";

export const metadata = { title: "Admin Platform | Aptinusa", description: "Pratinjau panel kendali operasional platform Aptinusa.", robots: { index: false, follow: false } };

const controls = [
  { icon: Users, title: "Tenant & ruang kerja", text: "Direktori organisasi, kepemilikan, siklus hidup, kuota, dan alur penangguhan ruang kerja.", tag: "KENDALI INTI", href: "/admin/" },
  { icon: CreditCard, title: "Paket & hak akses", text: "Katalog paket, akses modul, batas penggunaan, masa tenggang, dan validasi peristiwa penagihan.", tag: "PENAGIHAN", href: "/admin/" },
  { icon: Bot, title: "AI & modul", text: "Kesiapan penyedia, kebijakan model, alat dengan cakupan terbatas, anggaran token, dan hak akses modul.", tag: "OPERASIONAL AI", href: "/agents/" },
  { icon: Gauge, title: "Penggunaan & batas", text: "Permintaan API, pesan, konsumsi AI, tugas otomatisasi, dan kontrol batas laju.", tag: "PEMANTAUAN", href: "/status/" },
  { icon: BadgeCheck, title: "Audit & kepatuhan", text: "Akses sensitif, perubahan administratif, aktivitas ekspor, persetujuan, dan investigasi.", tag: "KEAMANAN", href: "/api/" },
  { icon: LifeBuoy, title: "Operasional dukungan", text: "Insiden pelanggan, kesiapan integrasi, eskalasi, dan komunikasi layanan.", tag: "DUKUNGAN", href: "/status/" },
];

export default function Admin() {
  return <PortalShell active="/admin/" area="admin">
    <div className="td-page-head"><div><span className="td-eyebrow">PANEL KENDALI PLATFORM / OPERASIONAL</span><h1>Pusat Kendali Aptinusa</h1><p>Operasikan platform dengan batas tenant yang jelas, data terverifikasi, dan perubahan yang dapat diaudit.</p></div><span className="td-admin-chip"><LockKeyhole size={15}/> PRATINJAU INTERNAL</span></div>
    <div className="td-preview-alert td-alert-admin"><ShieldCheck size={19}/><div><b>Pratinjau admin hanya-baca</b><p>Layar ini belum terhubung ke data tenant atau penagihan produksi. Tindakan administratif memerlukan peran terautentikasi, log audit persisten, dan pengujian keamanan menyeluruh.</p></div><span>TIDAK ADA DATA LANGSUNG</span></div>
    <div className="td-stat-grid">
      <article className="td-stat-card"><div className="td-stat-icon green"><Users size={19}/></div><span>Tenant terdaftar</span><strong>—</strong><small><CircleDashed size={12}/> Menunggu layanan tenant</small></article>
      <article className="td-stat-card"><div className="td-stat-icon blue"><CreditCard size={19}/></div><span>Langganan aktif</span><strong>—</strong><small><CircleDashed size={12}/> Penagihan belum terhubung</small></article>
      <article className="td-stat-card"><div className="td-stat-icon violet"><WalletCards size={19}/></div><span>Pendapatan berulang</span><strong>—</strong><small><CircleDashed size={12}/> Tidak ada data keuangan yang ditampilkan</small></article>
      <article className="td-stat-card"><div className="td-stat-icon amber"><Activity size={19}/></div><span>Status platform</span><strong>Preview</strong><small><CircleDashed size={12}/> Pemantauan belum aktif</small></article>
    </div>
    <div className="td-section-head"><div><h2>Operasional platform</h2><p>Area kendali yang direncanakan untuk operator platform terautentikasi.</p></div><span className="td-muted-label">6 AREA KENDALI</span></div>
    <div className="td-module-grid td-admin-module-grid">{controls.map(({icon:Icon,title,text,tag,href})=><Link href={href} className="td-module-card" key={title}><div className="td-module-top"><span className="td-module-icon"><Icon size={20}/></span><span className="td-module-tag">{tag}</span></div><h3>{title}</h3><p>{text}</p><span className="td-module-link">Buka area kendali <ArrowUpRight size={15}/></span></Link>)}</div>
    <div className="td-bottom-grid"><section className="td-panel"><div className="td-panel-head"><div><h2>Kesiapan rilis</h2><p>Gerbang produksi yang masih perlu diverifikasi</p></div><Workflow size={20}/></div><div className="td-readiness-list"><div><span>Runtime basis data dengan hak akses minimum</span><b className="td-pill td-pill-amber">Verifikasi</b></div><div><span>Autentikasi & penerapan peran</span><b className="td-pill td-pill-amber">Verifikasi</b></div><div><span>Persistensi audit & peringatan</span><b className="td-pill">Menunggu</b></div><div><span>Pengujian menyeluruh kanal resmi</span><b className="td-pill">Menunggu</b></div></div></section><section className="td-panel"><div className="td-panel-head"><div><h2>Postur keamanan</h2><p>Prinsip operasional wajib</p></div><ShieldCheck size={20}/></div><div className="td-security-line"><LockKeyhole size={17}/><span><b>Isolasi tenant</b><small>Setiap pembacaan dan penulisan harus dibatasi pada tenant yang berwenang.</small></span></div><div className="td-security-line"><BadgeCheck size={17}/><span><b>Hak akses minimum</b><small>Peran basis data dengan hak istimewa tinggi tidak boleh digunakan oleh runtime aplikasi.</small></span></div><div className="td-security-line"><Search size={17}/><span><b>Tindakan yang dapat diaudit</b><small>Perubahan berhak istimewa harus mencatat pelaku, cakupan, alasan, dan hasil.</small></span></div></section></div>
  </PortalShell>;
}
