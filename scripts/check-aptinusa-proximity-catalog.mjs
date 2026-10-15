import fs from "node:fs";
import assert from "node:assert/strict";

const file = new URL("../config/aptinusa-proximity-marketing.json", import.meta.url);
const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
const allowed = new Set(["available", "beta", "approval_required", "planned", "blocked"]);

assert.equal(catalog.schemaVersion, 1);
assert.equal(catalog.status, "planned");
assert.equal(catalog.pricingStatus, "proposal");
assert.ok(Array.isArray(catalog.modules) && catalog.modules.length >= 4);

const ids = new Set();
for (const module of catalog.modules) {
  assert.ok(module.id && !ids.has(module.id), `missing/duplicate module id: ${module.id}`);
  ids.add(module.id);
  assert.ok(allowed.has(module.status), `invalid status for ${module.id}`);
  assert.equal(module.liveMessagingEnabled, false, `live messaging must remain disabled: ${module.id}`);
  assert.equal(module.consentRequiredForMessaging, true, `messaging must require consent: ${module.id}`);
  if (module.status === "approval_required") {
    assert.equal(module.externalCosts, true, `external costs must be disclosed: ${module.id}`);
  }
}
assert.equal(catalog.safetyDefaults.liveMessagingEnabled, false);
assert.equal(catalog.safetyDefaults.requireExplicitChannelConsent, true);
assert.equal(catalog.safetyDefaults.requirePurposeSpecificConsent, true);
assert.equal(catalog.safetyDefaults.requireSuppressionCheck, true);
assert.equal(catalog.safetyDefaults.requireHumanApprovalForCampaignSend, true);
assert.equal(catalog.safetyDefaults.allowPassivePhoneNumberDiscovery, false);
assert.equal(catalog.safetyDefaults.allowCrossTenantContactReuse, false);
assert.equal(catalog.safetyDefaults.allowUnsolicitedProximityMessages, false);
console.log(`Aptinusa proximity catalog OK: ${catalog.modules.length} modules; live messaging disabled.`);
