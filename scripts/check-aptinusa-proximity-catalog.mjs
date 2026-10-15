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
for (const item of catalog.modules) {
  assert.ok(item.id && !ids.has(item.id), `missing/duplicate module id: ${item.id}`);
  ids.add(item.id);
  assert.ok(allowed.has(item.status), `invalid status for ${item.id}`);
  assert.equal(item.liveMessagingEnabled, false, `live messaging must remain disabled: ${item.id}`);
  assert.equal(item.consentRequiredForMessaging, true, `messaging must require consent: ${item.id}`);
  if (item.status === "approval_required") {
    assert.equal(item.externalCosts, true, `external costs must be disclosed: ${item.id}`);
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
