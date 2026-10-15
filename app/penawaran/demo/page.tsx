"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, Gift, MapPin, ShieldCheck, Sparkles, Tag } from "lucide-react";

export default function DemoOfferPage() {
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [consent, setConsent] = useState(false);
  const [destination, setDestination] = useState("");
  const [previewed, setPreviewed] = useState(false);

  const validDestination = destination.trim().length >= 8;
  const canPreview = consent && validDestination;

  function previewConsentFlow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPreview) return;
    setPreviewed(true);
  }

  return (
    <main className="offer-page">
      <header className="offer-nav">
        <Link href="/" className="offer-brand" aria-label="Kembali ke Aptinusa">
          <span className="offer-brand-mark">A</span>
          <span>APTINUSA <small>LOCAL OFFERS</small></span>
        </Link>
        <span className="offer-demo-label"><span /> MODE PRATINJAU</span>
      </header>

      <section className="offer-hero">
        <div className="offer-copy">
          <Link href="/" className="offer-back"><ArrowLeft size={15} /> Kembali ke Aptinusa</Link>
          <div className="offer-kicker"><Sparkles size={15} /> PENAWARAN BISNIS LOKAL</div>
          <h1>Temukan penawaran spesial di sekitar Anda.</h1>
          <p className="offer-lead">Contoh halaman yang dapat dibuka pelanggan setelah memindai QR di etalase, meja kasir, brosur, atau kemasan produk.</p>
          <div className="offer-pills">
            <span><ShieldCheck size={15} /> Lihat tanpa mendaftar</span>
            <span><Clock3 size={15} /> Informasi jelas</span>
          </div>
        </div>
        <div className="offer-card">
          <div className="offer-card-image">
            <div className="offer-image-glow" />
            <div className="offer-cup" aria-hidden="true"><span>✦</span></div>
            <span className="offer-discount"><Tag size={14} /> CONTOH PROMO</span>
          </div>
          <div className="offer-card-body">
            <div className="offer-business-line"><span className="offer-business-avatar">K</span><div><strong>Kedai Contoh</strong><small><MapPin size={12} /> Bisnis lokal · lokasi demo</small></div></div>
            <h2>Diskon 20% untuk minuman pilihan</h2>
            <p>Perlihatkan halaman ini saat memesan. Promo contoh untuk mendemonstrasikan alur penawaran digital Aptinusa.</p>
            <div className="offer-price"><strong>Hemat 20%</strong><span>Ketentuan berlaku · demo</span></div>
            <div className="offer-valid"><Clock3 size={14} /> Periode dan stok ditetapkan pemilik bisnis saat fitur aktif.</div>
          </div>
        </div>
      </section>

      <section className="offer-consent-wrap">
        <div className="offer-consent-intro">
          <div className="offer-icon-tile"><Gift size={22} /></div>
          <div><span className="offer-kicker">OPSIONAL</span><h2>Ingin menerima promo berikutnya?</h2><p>Penawaran di atas tetap dapat dilihat tanpa memberikan nomor telepon. Jika memilih berlangganan, tentukan kanal dan berikan persetujuan secara terpisah.</p></div>
        </div>
        <form className="offer-consent-form" onSubmit={previewConsentFlow}>
          <label className="offer-field-label" htmlFor="offer-destination">Nomor telepon Anda</label>
          <input id="offer-destination" type="tel" inputMode="tel" autoComplete="tel" placeholder="Contoh: 0812 3456 7890" value={destination} onChange={(event) => { setDestination(event.target.value); setPreviewed(false); }} aria-describedby="offer-number-help" />
          <small id="offer-number-help" className="offer-field-help">Hanya untuk pratinjau alur. Jangan masukkan nomor asli; data tidak dikirim atau disimpan.</small>
          <fieldset className="offer-channel-fieldset">
            <legend>Pilih kanal yang Anda setujui</legend>
            <label className={channel === "whatsapp" ? "offer-channel selected" : "offer-channel"}><input type="radio" name="offer-channel" value="whatsapp" checked={channel === "whatsapp"} onChange={() => { setChannel("whatsapp"); setPreviewed(false); }} /><span><strong>WhatsApp</strong><small>Promo melalui WhatsApp</small></span></label>
            <label className={channel === "sms" ? "offer-channel selected" : "offer-channel"}><input type="radio" name="offer-channel" value="sms" checked={channel === "sms"} onChange={() => { setChannel("sms"); setPreviewed(false); }} /><span><strong>SMS</strong><small>Promo melalui pesan teks</small></span></label>
          </fieldset>
          <label className="offer-consent-check"><input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setPreviewed(false); }} /><span>Saya setuju menerima informasi promosi dari <strong>Kedai Contoh</strong> melalui kanal yang saya pilih. Persetujuan ini opsional dan dapat dicabut kapan saja.</span></label>
          <button className="offer-submit" type="submit" disabled={!canPreview}>Pratinjau persetujuan <span>→</span></button>
          {previewed && <div className="offer-preview-result" role="status"><CheckCircle2 size={19} /><div><strong>Alur persetujuan berhasil dipratinjau.</strong><p>Simulasi: kanal {channel === "whatsapp" ? "WhatsApp" : "SMS"} dipilih. Tidak ada pesan yang dikirim dan tidak ada data yang disimpan.</p></div></div>}
          <p className="offer-privacy"><ShieldCheck size={15} /> Tidak ada pesan otomatis karena Anda berada di dekat toko. Persetujuan promosi harus jelas, khusus untuk kanal ini, dan dapat dicabut.</p>
        </form>
      </section>
      <footer className="offer-footer"><span>© Aptinusa · Pratinjau MVP penawaran lokal</span><span>Tanpa pelacakan lokasi pasif · Tanpa pengiriman pesan nyata</span></footer>

      <style jsx>{`
        .offer-page{min-height:100vh;background:#f6f8f6;color:#183127;font-family:Arial,Helvetica,sans-serif}
        .offer-nav{height:76px;padding:0 max(6vw,24px);display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #e5ece7}
        .offer-brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:#173d2d;font-size:13px;font-weight:900;letter-spacing:1px}
        .offer-brand-mark{display:grid;place-items:center;width:38px;height:38px;background:#176c4d;color:white;border-radius:12px;font-size:21px}
        .offer-brand small{display:block;font-size:8px;letter-spacing:2px;color:#849289;margin-top:4px}
        .offer-demo-label{font-size:10px;font-weight:800;letter-spacing:1px;color:#7b6a3f;background:#fbf4df;padding:10px 13px;border-radius:999px}.offer-demo-label span{display:inline-block;width:7px;height:7px;border-radius:50%;background:#d9a63c;margin-right:7px}
        .offer-hero{max-width:1120px;margin:auto;padding:64px 24px 48px;display:grid;grid-template-columns:1fr .92fr;gap:70px;align-items:center}
        .offer-back{display:inline-flex;align-items:center;gap:8px;color:#6d7f73;text-decoration:none;font-size:12px;margin-bottom:38px}
        .offer-kicker{display:inline-flex;align-items:center;gap:8px;color:#19704e;font-size:10px;font-weight:900;letter-spacing:1.6px}
        .offer-copy h1{font-size:clamp(38px,5vw,60px);line-height:1.04;letter-spacing:-2.7px;margin:20px 0;color:#153b2a;max-width:580px}
        .offer-lead{font-size:15px;line-height:1.8;color:#6e7e73;max-width:490px}
        .offer-pills{display:flex;gap:10px;flex-wrap:wrap;margin-top:25px}.offer-pills span{display:flex;align-items:center;gap:7px;padding:10px 12px;border:1px solid #dfe8e1;border-radius:999px;background:#fff;color:#51685a;font-size:11px}
        .offer-card{overflow:hidden;background:white;border:1px solid #e3ebe5;border-radius:23px;box-shadow:0 24px 70px #183d2b12}
        .offer-card-image{height:220px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 80%,#e5c79a 0,#c69d6b 30%,#47715c 31%,#214b38 75%);display:grid;place-items:center}
        .offer-image-glow{position:absolute;width:240px;height:240px;border:1px solid #ffffff25;border-radius:50%;box-shadow:0 0 0 28px #ffffff0c,0 0 0 56px #ffffff08}
        .offer-cup{width:105px;height:105px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#fff5e5,#e8d1a7);border:8px solid #f8f0e1;box-shadow:0 20px 40px #142f2290;color:#795538;font-size:44px;transform:translateY(8px)}
        .offer-discount{position:absolute;top:17px;left:17px;display:flex;align-items:center;gap:7px;background:#fff;color:#1a6245;border-radius:999px;padding:9px 12px;font-size:9px;font-weight:900;letter-spacing:1px}
        .offer-card-body{padding:25px 28px 28px}.offer-business-line{display:flex;align-items:center;gap:10px}.offer-business-avatar{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:#e9f4ec;color:#176b4a;font-weight:900}.offer-business-line strong,.offer-business-line small{display:block}.offer-business-line strong{font-size:12px}.offer-business-line small{display:flex;align-items:center;gap:3px;color:#839087;font-size:10px;margin-top:4px}
        .offer-card-body h2{font-size:22px;letter-spacing:-.7px;margin:22px 0 9px}.offer-card-body p{font-size:12px;line-height:1.7;color:#77857c}.offer-price{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-top:1px solid #edf1ed;border-bottom:1px solid #edf1ed;margin-top:18px}.offer-price strong{color:#176b4a;font-size:18px}.offer-price span{font-size:10px;color:#849087}.offer-valid{display:flex;align-items:center;gap:7px;color:#7d8a81;font-size:10px;margin-top:14px}
        .offer-consent-wrap{max-width:1120px;margin:0 auto 55px;padding:34px;background:#fff;border:1px solid #e5ece7;border-radius:22px;display:grid;grid-template-columns:.8fr 1fr;gap:48px}
        .offer-consent-intro{display:flex;gap:16px;align-items:flex-start}.offer-icon-tile{flex:0 0 48px;width:48px;height:48px;border-radius:15px;background:#eaf5ee;color:#176b4a;display:grid;place-items:center}.offer-consent-intro h2{font-size:24px;letter-spacing:-.8px;line-height:1.2;margin:13px 0}.offer-consent-intro p{font-size:12px;line-height:1.8;color:#748279;max-width:330px}
        .offer-consent-form{min-width:0}.offer-field-label{display:block;font-size:11px;font-weight:800;margin-bottom:8px}.offer-consent-form input[type=tel]{width:100%;border:1px solid #dce6df;border-radius:10px;padding:13px 14px;color:#183127;background:#fff;outline-offset:2px}.offer-field-help{display:block;color:#89958c;font-size:10px;line-height:1.5;margin-top:7px}.offer-channel-fieldset{border:0;padding:0;margin:22px 0 16px}.offer-channel-fieldset legend{font-size:11px;font-weight:800;margin-bottom:10px}.offer-channel{display:inline-flex;align-items:center;gap:9px;width:calc(50% - 6px);padding:12px;border:1px solid #dfe8e2;border-radius:10px;cursor:pointer}.offer-channel+.offer-channel{margin-left:8px}.offer-channel.selected{border-color:#3c9870;background:#f0f8f2}.offer-channel input{accent-color:#19704e}.offer-channel strong,.offer-channel small{display:block}.offer-channel strong{font-size:11px}.offer-channel small{font-size:9px;color:#849087;margin-top:4px}.offer-consent-check{display:flex;gap:10px;align-items:flex-start;color:#63746a;font-size:11px;line-height:1.65}.offer-consent-check input{margin-top:3px;accent-color:#19704e;flex:0 0 auto}.offer-submit{width:100%;display:flex;align-items:center;justify-content:space-between;border:0;border-radius:10px;background:#176b4a;color:#fff;padding:14px 16px;font-weight:800;margin-top:18px}.offer-submit:disabled{opacity:.42;cursor:not-allowed}.offer-preview-result{display:flex;gap:11px;background:#eef8f0;color:#1b704d;padding:13px;border-radius:10px;margin-top:13px}.offer-preview-result strong{font-size:11px}.offer-preview-result p{font-size:10px;line-height:1.6;margin:5px 0 0;color:#4c6c59}.offer-privacy{display:flex;align-items:flex-start;gap:7px;color:#89948d;font-size:10px;line-height:1.6;margin-top:17px}.offer-privacy svg{flex:0 0 auto}.offer-footer{max-width:1120px;margin:auto;padding:0 24px 28px;display:flex;justify-content:space-between;gap:16px;color:#8b978e;font-size:10px}
        @media(max-width:800px){.offer-hero{grid-template-columns:1fr;gap:35px;padding-top:35px}.offer-back{margin-bottom:28px}.offer-copy h1{letter-spacing:-1.7px}.offer-card-image{height:180px}.offer-consent-wrap{margin:0 16px 35px;padding:22px;grid-template-columns:1fr;gap:25px}.offer-footer{flex-direction:column}.offer-nav{height:66px}}
        @media(max-width:460px){.offer-demo-label{font-size:8px;padding:8px}.offer-hero{padding-left:18px;padding-right:18px}.offer-card-body{padding:20px}.offer-price{align-items:flex-start;gap:10px;flex-direction:column}.offer-consent-wrap{padding:18px}.offer-channel{width:100%}.offer-channel+.offer-channel{margin:8px 0 0}}
      `}</style>
    </main>
  );
}
