import fs from "node:fs";
import assert from "node:assert/strict";

const path = new URL("../config/aptinusa-growth-modules.json", import.meta.url);
const catalog = JSON.parse(fs.readFileSync(path, "utf8"));
const allowedStatuses = new Set(["available", "beta", "approval_required", "planned", "blocked"]);

assert.equal(catalog.schemaVersion, 1, "unsupported catalog schema version");
assert.equal(catalog.currency, "IDR", "pricing currency must be IDR");
assert.equal(catalog.pricingStatus, "proposal", "unapproved prices must remain marked as proposal");
assert.ok(Array.isArray(catalog.modules) && catalog.modules.length > 0, "catalog must contain modules");
assert.ok(Array.isArray(catalog.plans) && catalog.plans.length > 0, "catalog must contain plans");

const ids = new Set();
for (const item of catalog.modules) {
  assert.ok(item.id && !ids.has(item.id), `module id missing or duplicated: ${item.id}`);
  ids.add(item.id);
  assert.ok(allowedStatuses.has(item.status), `invalid status for ${item.id}: ${item.status}`);
  assert.equal(typeof item.requiresExplicitApprovalForExternalAction, "boolean", `approval flag required: ${item.id}`);
  if (item.status === "approval_required") {
    assert.equal(item.externalCosts, true, `approval-required module should disclose external costs: ${item.id}`);
  }
}

for (const plan of catalog.plans) {
  assert.ok(plan.id && plan.name, "plan id and name are required");
  assert.equal(plan.priceStatus, "proposal", `unapproved plan price must remain proposal: ${plan.id}`);
  if (plan.monthlyPriceIdr !== null) {
    assert.ok(Number.isInteger(plan.monthlyPriceIdr) && plan.monthlyPriceIdr >= 0, `invalid price: ${plan.id}`);
  }
}

assert.equal(catalog.safetyDefaults.liveMessagingEnabled, false, "live messaging must remain disabled by default");
assert.equal(catalog.safetyDefaults.requireTenantScopedConsent, true, "tenant-scoped consent must be required");
assert.equal(catalog.safetyDefaults.requireOptOutSuppressionCheck, true, "opt-out suppression checks must be required");
assert.equal(catalog.safetyDefaults.requireHumanApprovalForCampaignSend, true, "campaign sends must require human approval");
assert.equal(catalog.safetyDefaults.seoRankingGuarantee, false, "SEO ranking guarantees must remain disabled");
assert.equal(catalog.safetyDefaults.crossTenantContactReuse, false, "cross-tenant contact reuse must remain disabled");

console.log(`Aptinusa Growth catalog OK: ${catalog.modules.length} modules, ${catalog.plans.length} proposed plans.`);
