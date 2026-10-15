/**
 * Local inbox triage rules. This is a deterministic demo helper, not a live channel event processor.
 * Never use this classification alone to make safety-critical or financial decisions.
 */
export type InboxCategory =
  | "Darurat"
  | "Keluhan"
  | "Pembayaran"
  | "Pemesanan"
  | "Ketersediaan"
  | "Harga"
  | "Operasional"
  | "Lainnya";
export type InboxPriority = "Mendesak" | "Tinggi" | "Sedang" | "Normal";
export type InboxTriage = {
  category: InboxCategory;
  priority: InboxPriority;
  recommendedStatus: "Butuh tinjauan" | "AI menangani";
  reason: string;
};

const rules: Array<{ category: InboxCategory; priority: InboxPriority; keywords: string[]; reason: string; review?: boolean }> = [
  { category: "Darurat", priority: "Mendesak", keywords: ["kecelakaan", "darurat", "cedera", "korban", "kebakaran", "rem blong", "mogok di jalan", "ban pecah", "terjebak"], reason: "Utamakan keselamatan; petugas perlu segera meninjau.", review: true },
  { category: "Keluhan", priority: "Tinggi", keywords: ["komplain", "kecewa", "keluhan", "tidak puas", "penipuan", "ditipu", "sopir tidak datang", "pelayanan buruk"], reason: "Keluhan atau indikasi masalah layanan perlu ditinjau petugas.", review: true },
  { category: "Pembayaran", priority: "Tinggi", keywords: ["refund", "uang kembali", "pengembalian dana", "sudah transfer", "pembayaran gagal", "qris", "rekening", "invoice", "tagihan", "deposit"], reason: "Jangan memastikan status atau nominal transaksi tanpa data resmi.", review: true },
  { category: "Pemesanan", priority: "Sedang", keywords: ["booking", "pesan mobil", "reservasi", "mau sewa", "perpanjang", "ubah jadwal", "reschedule", "batalkan"], reason: "Perlu verifikasi jadwal dan ketentuan pemesanan.", review: true },
  { category: "Ketersediaan", priority: "Sedang", keywords: ["tersedia", "kosong", "masih ada", "ready unit", "besok", "hari ini", "tanggal berapa"], reason: "Perlu pemeriksaan inventori sebelum menjanjikan unit." },
  { category: "Harga", priority: "Normal", keywords: ["harga", "tarif", "berapa", "biaya", "diskon", "promo", "murah"], reason: "Jawaban harga harus mengacu pada katalog tenant yang terverifikasi." },
  { category: "Operasional", priority: "Sedang", keywords: ["jemput", "antar", "bandara", "stasiun", "sopir", "driver", "lokasi", "jam buka", "alamat"], reason: "Periksa detail lokasi, waktu, dan cakupan layanan." }
];

export function classifyInboxMessage(message: string): InboxTriage {
  const normalized = message.normalize("NFKC").toLocaleLowerCase("id-ID");
  const match = rules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  if (!match) {
    return {
      category: "Lainnya",
      priority: "Normal",
      recommendedStatus: "Butuh tinjauan",
      reason: "Maksud pesan belum cukup jelas; minta konteks atau alihkan ke petugas."
    };
  }
  return {
    category: match.category,
    priority: match.priority,
    recommendedStatus: match.review ? "Butuh tinjauan" : "AI menangani",
    reason: match.reason
  };
}
