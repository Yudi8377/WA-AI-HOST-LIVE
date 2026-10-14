"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bot, CheckCircle2, LockKeyhole, Menu, ShieldCheck, X } from "lucide-react";

/* Adapted from Start Bootstrap One Page Wonder (MIT), retaining its original page structure. */
const sections = [
  {
    id: "customer-intelligence",
    kicker: "KECERDASAN PELANGGAN",
    title: "Setiap percakapan menjadi wawasan bisnis.",
    text: "Satukan percakapan pelanggan, pengalihan ke tim, dan pengetahuan bersama dalam satu ruang kerja. Bantu tim merespons secara konsisten tanpa kehilangan konteks hubungan dengan pelanggan.",
    bullets: ["Percakapan pelanggan dan konteks bersama", "Pengalihan ke petugas dan alur kerja berbasis izin", "Alur yang jelas dari pertanyaan hingga tindak lanjut"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=85",
    alt: "Team collaborating around a digital workspace",
    href: "/workspace/",
    link: "Jelajahi ruang percakapan",
    reverse: true
  },
  {
    id: "connected-workflows",
    kicker: "ALUR KERJA TERHUBUNG",
    title: "Otomatiskan pekerjaan berulang dengan kontrol.",
    text: "Koordinasikan CRM, tindak lanjut penjualan, pengetahuan, dan otomatisasi dalam satu lapisan operasional modular. Setiap koneksi menampilkan izin, kesiapan, dan penanggung jawab sebelum diaktifkan.",
    bullets: ["Alur kerja modular untuk beragam kebutuhan bisnis", "Aksi terbatas, persetujuan, dan pencatatan audit", "Kesiapan kanal resmi ditampilkan secara transparan"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
    alt: "Business team planning a coordinated workflow",
    href: "/connectors/",
    link: "Tinjau integrasi",
    reverse: false
  },
  {
    id: "coordinated-ai",
    kicker: "AI TERKOORDINASI",
    title: "Agen khusus. Satu ruang kerja dengan tata kelola.",
    text: "Gunakan peran AI khusus untuk dukungan, pengetahuan, operasional, dan analisis. Koordinasi mengikuti kebijakan bersama, batas anggaran, isolasi tenant, dan tinjauan manusia—bukan akses agen tanpa kendali.",
    bullets: ["Tanggung jawab agen sesuai tujuan", "Akses dan izin alat sesuai tenant", "Tinjauan manusia untuk tindakan sensitif atau eksternal"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85",
    alt: "Colleagues working together on strategy",
    href: "/agents/",
    link: "Jelajahi arsitektur AI",
    reverse: true
  }
];

export default function Website() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <main className="opw-site" id="page-top">
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top" aria-label="Navigasi utama">
        <div className="container px-5">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/" onClick={closeMenu}>
            <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-success" style={{width: 38, height: 38}}><Bot size={22}/></span>
            <span>APTINUSA</span>
          </Link>
          <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-controls="navbarResponsive" aria-expanded={menuOpen} aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}>
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarResponsive">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item"><Link className="nav-link" href="#platform" onClick={closeMenu}>Platform</Link></li>
              <li className="nav-item"><Link className="nav-link" href="#how-it-works" onClick={closeMenu}>Cara kerja</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/api/" onClick={closeMenu}>Pengembang</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/status/" onClick={closeMenu}>Status</Link></li>
              <li className="nav-item ms-lg-2"><Link className="nav-link fw-bold" href="/dashboard/" onClick={closeMenu}>Buka ruang kerja <ArrowRight size={15} className="ms-1"/></Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="masthead text-center text-white">
        <div className="masthead-content">
          <div className="container px-5">
            <span className="aptinusa-eyebrow"><Bot size={14} className="me-2"/> KECERDASAN ADAPTIF · BISNIS TERHUBUNG</span>
            <h1 className="masthead-heading mb-0">Bisnis Anda,<br/>bergerak sebagai satu kesatuan.</h1>
            <h2 className="masthead-subheading mb-0">Konteks pelanggan. Alur kerja terhubung. AI terkoordinasi.</h2>
            <p className="lead mx-auto mt-4 mb-0" style={{maxWidth: 760}}>Ruang kerja bisnis berbasis AI yang modular untuk menghubungkan interaksi pelanggan, operasional, dan bantuan cerdas—mulai dari tim yang sedang berkembang hingga perusahaan besar.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
              <Link className="btn btn-primary btn-xl rounded-pill" href="/dashboard/">Jelajahi ruang kerja <ArrowRight size={17} className="ms-2"/></Link>
              <Link className="btn btn-outline-light btn-xl rounded-pill" href="#platform">Kenali platform</Link>
            </div>
            <div className="d-flex justify-content-center flex-wrap gap-4 mt-4 small">
              <span><ShieldCheck size={15} className="me-2"/>Dirancang dengan isolasi tenant</span>
              <span><LockKeyhole size={15} className="me-2"/>Alur kerja mengutamakan izin</span>
            </div>
          </div>
        </div>
        <div className="bg-circle-1 bg-circle" aria-hidden="true"></div>
        <div className="bg-circle-2 bg-circle" aria-hidden="true"></div>
        <div className="bg-circle-3 bg-circle" aria-hidden="true"></div>
        <div className="bg-circle-4 bg-circle" aria-hidden="true"></div>
      </header>

      <section id="platform" className="opw-platform-intro">
        <div className="container px-5 py-5">
          <div className="row gx-5 align-items-end">
            <div className="col-lg-7">
              <span className="opw-section-kicker">SATU PLATFORM MODULAR</span>
              <h2 className="display-4 fw-bold mb-0">Mulai dari satu kebutuhan.<br/>Kembangkan sesuai kebutuhan Anda.</h2>
            </div>
            <div className="col-lg-5">
              <p className="opw-section-copy mb-0">Aptinusa menyatukan berbagai kemampuan bisnis dengan kontrol yang tetap transparan. Aktifkan kanal dan modul setelah akses resmi, otorisasi, dan pemeriksaan kesiapan selesai.</p>
            </div>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section id={section.id} key={section.id} className="opw-feature-section">
          <div className="container px-5">
            <div className="row gx-5 align-items-center">
              <div className={`col-lg-6 ${section.reverse ? "order-lg-2" : ""}`}>
                <div className="p-5">
                  <img className="img-fluid rounded-circle opw-circle-image" src={section.image} alt={section.alt} loading="lazy"/>
                </div>
              </div>
              <div className={`col-lg-6 ${section.reverse ? "order-lg-1" : ""}`}>
                <div className="p-5">
                  <span className="opw-section-kicker">{section.kicker}</span>
                  <h2 className="display-4 fw-bold">{section.title}</h2>
                  <p className="opw-section-copy">{section.text}</p>
                  <ul className="list-unstyled mt-4 mb-4">
                    {section.bullets.map((bullet) => <li key={bullet} className="mb-2"><CheckCircle2 size={17} className="me-2 text-success"/>{bullet}</li>)}
                  </ul>
                  <Link className="opw-section-link" href={section.href}>{section.link} <ArrowRight size={17}/></Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="how-it-works" className="opw-steps-section py-5">
        <div className="container px-5 py-4">
          <div className="text-center mb-5">
            <span className="opw-section-kicker">JALUR TERKENDALI MENUJU PELUNCURAN</span>
            <h2 className="display-4 fw-bold mb-3">Terhubung dengan yakin.</h2>
            <p className="opw-section-copy mx-auto" style={{maxWidth: 760}}>Tahapan yang jelas dari penyiapan ruang kerja hingga produksi—tanpa menyatakan konektor yang belum terverifikasi sebagai aktif.</p>
          </div>
          <div className="row gx-4 gy-4">
            <div className="col-md-4"><article className="opw-step-card h-100 p-4"><span className="opw-step-number">01</span><h3 className="h4 fw-bold mt-4">Siapkan ruang kerja</h3><p className="mb-0">Tentukan organisasi, akses tim, modul, dan batas operasional Anda.</p></article></div>
            <div className="col-md-4"><article className="opw-step-card h-100 p-4"><span className="opw-step-number">02</span><h3 className="h4 fw-bold mt-4">Hubungkan kanal resmi</h3><p className="mb-0">Otorisasikan integrasi yang didukung dan tinjau akses yang dimiliki setiap koneksi.</p></article></div>
            <div className="col-md-4"><article className="opw-step-card h-100 p-4"><span className="opw-step-number">03</span><h3 className="h4 fw-bold mt-4">Uji sebelum aktivasi</h3><p className="mb-0">Validasi alur kerja, batas penggunaan, persetujuan, dan pengalihan ke petugas sebelum beroperasi.</p></article></div>
          </div>
        </div>
      </section>

      <section className="opw-cta-band">
        <div className="container px-5">
          <span className="aptinusa-eyebrow">UNTUK TIM KECIL HINGGA PERUSAHAAN BESAR</span>
          <h2>Manfaatkan kecerdasan.<br/>Tetap kendalikan bisnis Anda.</h2>
          <p>Jelajahi ruang kerja dan kemampuan platform Aptinusa. Koneksi produksi hanya diaktifkan setelah verifikasi menyeluruh.</p>
          <Link className="btn btn-primary btn-xl rounded-pill" href="/dashboard/">Buka ruang kerja pelanggan <ArrowRight size={17} className="ms-2"/></Link>
        </div>
      </section>

      <footer className="py-5 bg-black text-white">
        <div className="container px-5 text-center">
          <Link href="/" className="d-inline-flex align-items-center justify-content-center gap-2 text-white text-decoration-none fw-bold"><Bot size={24}/> APTINUSA</Link>
          <p className="small mt-3 mb-0">Kecerdasan Adaptif. Bisnis Terhubung.</p>
          <div className="opw-footer-links">
            <Link href="/api/">Dokumentasi API</Link>
            <Link href="/connectors/">Integrasi</Link>
            <Link href="/agents/">Arsitektur AI</Link>
            <Link href="/status/">Status layanan</Link>
            <Link href="/admin/">Pratinjau admin</Link>
          </div>
          <p className="opw-footer-note mb-0">Pratinjau produk. Autentikasi, penagihan, dan pengiriman pesan eksternal belum dinyatakan aktif sampai alur produksinya terverifikasi.</p>
          <p className="small text-white-50 mt-4 mb-0">© {new Date().getFullYear()} Aptinusa. Hak cipta dilindungi.</p>
        </div>
      </footer>
    </main>
  );
}
