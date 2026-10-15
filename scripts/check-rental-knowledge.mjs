import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const knowledge = readFileSync(new URL("../lib/rental-knowledge.ts", import.meta.url), "utf8");
const workspace = readFileSync(new URL("../app/workspace/page.tsx", import.meta.url), "utf8");
const knowledgeIds = [...knowledge.matchAll(/id:"K\d+"/g)];
const caseIds = [...knowledge.matchAll(/\{id:\d+,title:/g)];

assert.ok(knowledgeIds.length >= 40, `Expected at least 40 bundled local knowledge topics, found ${knowledgeIds.length}`);
assert.ok(caseIds.length >= 20, `Expected 20 regression cases, found ${caseIds.length}`);
for (const topic of ["availability", "selfdrive", "booking", "modify", "cancel", "payment", "deposit", "fuel", "late_return", "incident", "breakdown", "insurance", "complaint", "privacy", "fraud", "corporate", "accessory", "outcity", "human"]) {
  assert.ok(knowledge.includes(`intent:"${topic}"`), `Missing local rental topic: ${topic}`);
}
for (const agent of ["intent-classifier", "local-knowledge-retriever", "policy-guardrail", "response-composer"]) {
  assert.ok(knowledge.includes(agent), `Missing agent stage: ${agent}`);
}
assert.ok(workspace.includes('from "@/lib/rental-knowledge"'), "Workspace must use the bundled local knowledge engine");
assert.ok(!/\b(fetch|axios)\s*\(/.test(knowledge), "Local knowledge engine must not make network requests");
assert.ok(knowledge.includes("bukan harga resmi") && knowledge.includes("tidak akan menjanjikan"), "The engine must disclose demo pricing and avoid unverified promises");
console.log(`Local rental knowledge checks passed: ${knowledgeIds.length} topics, ${caseIds.length} scenarios, 4 agent stages.`);
