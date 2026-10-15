import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../lib/inbox-triage.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
}).outputText;
const moduleUrl = "data:text/javascript;base64," + Buffer.from(compiled).toString("base64");
const triage = await import(moduleUrl);

const cases = [
  ["Mobil sewaan saya mengalami kecelakaan, ada korban.", "Darurat", "Mendesak", "Butuh tinjauan"],
  ["Saya kecewa dengan pelayanan sopir tadi.", "Keluhan", "Tinggi", "Butuh tinjauan"],
  ["Kalau batal, uang kembali tidak?", "Pembayaran", "Tinggi", "Butuh tinjauan"],
  ["Saya mau booking Avanza untuk besok.", "Pemesanan", "Sedang", "Butuh tinjauan"],
  ["Besok Avanza masih tersedia tidak?", "Ketersediaan", "Sedang", "AI menangani"],
  ["Berapa harga sewa Avanza 24 jam?", "Harga", "Normal", "AI menangani"],
  ["Bisa jemput di Bandara Juanda?", "Operasional", "Sedang", "AI menangani"],
  ["xyz qqq pertanyaan tidak jelas", "Lainnya", "Normal", "Butuh tinjauan"]
];
for (const [message, category, priority, status] of cases) {
  const result = triage.classifyInboxMessage(message);
  assert.equal(result.category, category, "category for: " + message);
  assert.equal(result.priority, priority, "priority for: " + message);
  assert.equal(result.recommendedStatus, status, "recommended status for: " + message);
  assert.ok(result.reason.length > 10);
}
console.log("Inbox triage regression tests passed: " + cases.length + " category/priority/status cases.");
