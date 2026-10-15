import assert from "node:assert/strict";
import { createDryRunDeliveryPlan } from "../lib/aptinusa-dry-run-delivery-queue.mjs";

const permitted = { allowed: true, decision: "allow_queue_only", messageSent: false };
const plan = createDryRunDeliveryPlan({
  policyDecision: permitted,
  campaignId: "campaign-1",
  tenantId: "tenant-a",
  channel: "whatsapp",
  purpose: "marketing",
  idempotencyKey: "campaign-1-contact-1",
});
assert.equal(plan.accepted, true);
assert.equal(plan.mode, "dry_run");
assert.equal(plan.status, "preview_only");
assert.equal(plan.deliveryAttempted, false);
assert.equal(plan.persisted, false);
assert.equal(plan.queued, false);
assert.equal(plan.destinationIncluded, false);
assert.equal(plan.payloadIncluded, false);
assert.equal("destination" in plan, false);
assert.equal("message" in plan, false);
assert.equal(Object.isFrozen(plan), true);
assert.equal(plan.planId, createDryRunDeliveryPlan({
  policyDecision: permitted,
  campaignId: "campaign-1",
  tenantId: "tenant-a",
  channel: "whatsapp",
  purpose: "marketing",
  idempotencyKey: "campaign-1-contact-1",
}).planId);

const blocked = createDryRunDeliveryPlan({ policyDecision: { allowed: false, decision: "deny" } });
assert.equal(blocked.accepted, false);
assert.equal(blocked.deliveryAttempted, false);
assert.equal(blocked.reason, "POLICY_NOT_ALLOWED");

const missing = createDryRunDeliveryPlan({
  policyDecision: permitted, campaignId: "campaign-1", tenantId: "tenant-a",
  channel: "whatsapp", purpose: "marketing", idempotencyKey: " ",
});
assert.equal(missing.accepted, false);
assert.equal(missing.reason, "CONTEXT_INCOMPLETE");

const invalid = createDryRunDeliveryPlan({
  policyDecision: permitted, campaignId: "campaign-1", tenantId: "tenant-a",
  channel: "carrier-pigeon", purpose: "marketing", idempotencyKey: "key",
});
assert.equal(invalid.accepted, false);
assert.equal(invalid.reason, "CHANNEL_OR_PURPOSE_INVALID");

console.log("Aptinusa dry-run queue contract passed: deterministic idempotency, sanitized preview, no persistence, queue, or delivery.");
