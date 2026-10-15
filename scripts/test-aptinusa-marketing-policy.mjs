import assert from "node:assert/strict";
import { evaluateMarketingSend } from "../lib/aptinusa-marketing-policy.mjs";

const valid = {
  actorTenantId: "tenant-a",
  campaignTenantId: "tenant-a",
  contactTenantId: "tenant-a",
  contactId: "contact-1",
  channel: "whatsapp",
  purpose: "marketing",
  consent: {
    active: true,
    revokedAt: null,
    tenantId: "tenant-a",
    contactId: "contact-1",
    channel: "whatsapp",
    purpose: "marketing",
    capturedAt: "2026-10-15T00:00:00.000Z",
    noticeVersion: "v1",
    source: "qr-form",
  },
  suppressed: false,
  destinationProvidedByContact: true,
  destinationVerified: true,
  providerConfigured: true,
  providerAuthorized: true,
  campaignApproved: true,
  spendWithinLimit: true,
  quietHoursAllowed: true,
  frequencyAllowed: true,
  liveMessagingEnabled: true,
  idempotencyKey: "campaign-1-contact-1",
};

const permitted = evaluateMarketingSend(valid);
assert.equal(permitted.allowed, true);
assert.equal(permitted.decision, "allow_queue_only");
assert.equal(permitted.messageSent, false);

const deny = (patch, expected) => {
  const result = evaluateMarketingSend({ ...valid, ...patch });
  assert.equal(result.allowed, false, `expected denial: ${expected}`);
  assert.ok(result.reasonCodes.includes(expected), `missing reason ${expected}: ${result.reasonCodes.join(",")}`);
  assert.equal(result.messageSent, false);
};

deny({ actorTenantId: "tenant-b" }, "TENANT_SCOPE_MISMATCH");
deny({ contactTenantId: "tenant-b" }, "TENANT_SCOPE_MISMATCH");
deny({ consent: { ...valid.consent, revokedAt: "2026-10-15T01:00:00.000Z" } }, "CONSENT_INACTIVE_OR_REVOKED");
deny({ consent: { ...valid.consent, channel: "sms" } }, "CONSENT_CHANNEL_MISMATCH");
deny({ consent: { ...valid.consent, purpose: "service_updates" } }, "CONSENT_PURPOSE_MISMATCH");
deny({ suppressed: true }, "DESTINATION_SUPPRESSED_OR_STATUS_UNKNOWN");
deny({ suppressed: undefined }, "DESTINATION_SUPPRESSED_OR_STATUS_UNKNOWN");
deny({ providerAuthorized: false }, "PROVIDER_NOT_AUTHORIZED");
deny({ campaignApproved: false }, "CAMPAIGN_NOT_APPROVED");
deny({ spendWithinLimit: false }, "SPEND_LIMIT_EXCEEDED");
deny({ liveMessagingEnabled: false }, "LIVE_MESSAGING_DISABLED");
deny({ consent: { ...valid.consent, noticeVersion: "" } }, "CONSENT_EVIDENCE_INCOMPLETE");
deny({ idempotencyKey: "" }, "IDEMPOTENCY_KEY_MISSING");

const unknown = evaluateMarketingSend();
assert.equal(unknown.allowed, false);
assert.ok(unknown.reasonCodes.length >= 8);
console.log("Aptinusa marketing policy tests passed: allow-only-with-evidence, fail-closed defaults, tenant isolation, consent, suppression, approval, and budget gates.");
