import Link from "next/link";
import { Activity, Bot, Boxes, CheckCircle2, CircleDashed, CreditCard, Link2, MessageSquareText, ShieldCheck, Users, Workflow, ArrowUpRight, Settings2 } from "lucide-react";
import { PortalShell } from "../components/PortalShell";

export const metadata = { title: "Ruang Kerja Pelanggan | Aptinusa", description: "Pratinjau ruang kerja pelanggan Aptinusa.", robots: { index: false, follow: false } };

const modules = [
  { icon: MessageSquareText, title: "Kotak masuk & layanan pelanggan", text: "Tinjau percakapan, draf AI, pengalihan ke petugas, dan konteks pelanggan.", href: "/workspace/", status: "Pratinjau" },
  { icon: Link2, title: "Koneksi kanal", text: "Kelola akun terotorisasi, izin, kesehatan koneksi, dan pencabutan akses.", href: "/connectors/", status: "Perlu disiapkan" },
  { icon: Bot, title: "Asisten AI", text: "Atur gaya bahasa, sumber pengetahuan, batasan, dan aturan pengalihan ke petugas.", href: "/agents/", status: "Pratinjau" },
  { icon: Workflow, title: "Otomatisasi alur kerja", text: "Rancang pemicu, kondisi, tindakan yang disetujui, percobaan ulang, dan langkah audit.", href: "/agents/", status: "Direncanakan" },
  { icon: Boxes, title: "Data bisnis", text: "Atur prospek, catatan pelanggan, konteks katalog, dan sinkronisasi yang disetujui.", href: "/api/", status: "Belum terhubung" },
  { icon: Users, title: "Tim & akses", text: "Siapkan peran ruang kerja, undangan tim, dan peninjauan izin.", href: "/dashboard/", status: "Pratinjau" },
];

export default function Dashboard() {
  return <PortalShell active="/dashboard/" area="customer">
    <div className="td-page-head"><div><span className="td-eyebrow">RUANG KERJA PELANGGAN / RINGKASAN</span><h1>Senang Anda hadir di sini.</h1><p>Peralatan bisnis, kanal, dan bantuan AI Anda—tertata di satu tempat.</p></div><Link className="td-outline-button" href="/connectors/"><Settings2 size={16}/> Pengaturan ruang kerja</Link></div>
    <div className="td-preview-alert"><CircleDashed size={19}/><div><b>Pratinjau workspace</b><p>Ini adalah pratinjau antarmuka, bukan akun pelanggan yang terautentikasi. Jangan masukkan data pribadi, token akses, atau kredensial produksi di sini.</p></div><span>PENGEMBANGAN</span></div>
    <div className="td-stat-grid">
      <article className="td-stat-card"><div className="td-stat-icon green"><MessageSquareText size={19}/></div><span>Percakapan</span><strong>—</strong><small><CircleDashed size={12}/> Menunggu layanan kotak masuk</small></article>
      <article className="td-stat-card"><div className="td-stat-icon blue"><Link2 size={19}/></div><span>Kanal terhubung</span><strong>0</strong><small><CircleDashed size={12}/> Belum ada konektor aktif</small></article>
      <article className="td-stat-card"><div className="td-stat-icon violet"><Bot size={19}/></div><span>Asisten AI</span><strong>Pratinjau</strong><small><CircleDashed size={12}/> Penyedia model belum terhubung</small></article>
      <article className="td-stat-card"><div className="td-stat-icon amber"><CreditCard size={19}/></div><span>Paket & penggunaan</span><strong>—</strong><small><CircleDashed size={12}/> Penagihan belum terhubung</small></article>
    </div>
    <div className="td-section-head"><div><h2>Ruang kerja Anda</h2><p>Pilih fitur untuk melihat pengaturan dan persyaratan kesiapannya.</p></div><span className="td-muted-label">6 MODUL</span></div>
    <div className="td-module-grid">{modules.map(({icon:Icon,title,text,href,status})=><Link href={href} className="td-module-card" key={title}><div className="td-module-top"><span className="td-module-icon"><Icon size={20}/></span><span className={status==="Pratinjau"?"td-pill td-pill-green":status==="Perlu disiapkan"?"td-pill td-pill-amber":"td-pill"}>{status}</span></div><h3>{title}</h3><p>{text}</p><span className="td-module-link">Buka modul <ArrowUpRight size={15}/></span></Link>)}</div>
    <div className="td-bottom-grid"><section className="td-panel"><div className="td-panel-head"><div><h2>Memulai</h2><p>Urutan penyiapan yang disarankan</p></div><ShieldCheck size={20}/></div><div className="td-checklist"><div><CheckCircle2 size={17}/><span><b>Tinjau batas ruang kerja</b><small>Tentukan penanggung jawab dan peran akses sebelum mengundang tim.</small></span><em>LANGKAH 1</em></div><div><CircleDashed size={17}/><span><b>Hubungkan kanal resmi</b><small>Otorisasikan akun bisnis dan tinjau cakupan izin yang diminta.</small></span><em>LANGKAH 2</em></div><div><CircleDashed size={17}/><span><b>Uji AI dan pengalihan ke petugas</b><small>Lakukan pengujian terkendali sebelum mengaktifkan pesan pelanggan sungguhan.</small></span><em>LANGKAH 3</em></div></div></section><section className="td-panel"><div className="td-panel-head"><div><h2>Kesehatan ruang kerja</h2><p>Kesiapan integrasi saat ini</p></div><Activity size={20}/></div><div className="td-health-row"><span><i className="td-health-dot amber-dot"/> Autentikasi</span><b>Belum terhubung</b></div><div className="td-health-row"><span><i className="td-health-dot gray-dot"/> API pesan</span><b>Not verified</b></div><div className="td-health-row"><span><i className="td-health-dot gray-dot"/> Penagihan langganan</span><b>Belum terhubung</b></div><div className="td-health-note">Status langsung akan muncul di sini setelah pemantauan layanan terhubung.</div></section></div>
  </PortalShell>;
}
