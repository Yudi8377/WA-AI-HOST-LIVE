import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../lib/rental-knowledge.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
}).outputText;
const moduleUrl = "data:text/javascript;base64," + Buffer.from(compiled).toString("base64");
const engine = await import(moduleUrl);

const intentCases = [
  ["Berapa harga sewa Avanza 24 jam?", "harga"],
  ["Besok Avanza masih tersedia tidak?", "availability"],
  ["Kalau pakai sopir berapa biayanya?", "driver"],
  ["Bisa jemput di Bandara Juanda jam 5 pagi?", "airport"],
  ["Saya mau booking Avanza untuk tanggal 22 Oktober.", "booking"],
  ["Kalau batal, uang kembali tidak?", "cancel"],
  ["Mobil sewaan saya mengalami kecelakaan.", "incident"],
  ["Saya kecewa dengan pelayanan sopir tadi.", "complaint"],
  ["Bisa bayar pakai QRIS?", "payment"],
  ["Sopir tidak datang sesuai jadwal.", "driver_issue"],
  ["Mobil mogok di jalan.", "breakdown"],
  ["Boleh dibawa ke Malaysia?", "cross_border"],
  ["Saya ingin bicara dengan admin manusia.", "human"]
];

for (const [message, expectedIntent] of intentCases) {
  assert.equal(
    engine.classifyRentalIntent(message),
    expectedIntent,
    `Intent regression: "${message}"`
  );
}

const priceReply = engine.answerRentalMessage("Berapa harga sewa Avanza 24 jam?");
assert.equal(priceReply.intent, "harga");
assert.match(priceReply.text, /bukan penawaran resmi/i);
assert.equal(priceReply.escalate, false);

const availabilityReply = engine.answerRentalMessage("Besok Avanza masih tersedia tidak?");
assert.equal(availabilityReply.intent, "availability");
assert.match(availabilityReply.text, /belum bisa memastikan/i);
assert.match(availabilityReply.text, /tidak akan menjanjikan unit/i);

for (const message of [
  "Mobil sewaan saya mengalami kecelakaan.",
  "Saya kecewa dengan pelayanan sopir tadi.",
  "Kalau batal, uang kembali tidak?",
  "Saya ingin bicara dengan admin manusia."
]) {
  const reply = engine.answerRentalMessage(message);
  assert.equal(reply.escalate, true, `High-risk/handoff must escalate: "${message}"`);
}

const uncertain = engine.answerRentalMessage("xyz qqq pertanyaan tidak jelas");
assert.equal(uncertain.intent, "clarify");
assert.equal(uncertain.escalate, true);
assert.ok(uncertain.confidence < 0.55);

for (const reply of [priceReply, availabilityReply, uncertain]) {
  assert.ok(Array.isArray(reply.knowledgeIds) && reply.knowledgeIds.length > 0);
  assert.deepEqual(reply.agents, [
    "intent-classifier",
    "local-knowledge-retriever",
    "policy-guardrail",
    "response-composer"
  ]);
}

console.log(`Rental response regression tests passed: ${intentCases.length} intent cases plus pricing, availability, escalation, and uncertainty guardrails.`);
