import { createHash } from "node:crypto";

/**
 * Creates a sanitized, provider-neutral dry-run plan.
 * It deliberately does not persist, enqueue, or deliver anything.
 */
export function createDryRunDeliveryPlan({ policyDecision, campaignId, tenantId, channel, purpose, idempotencyKey } = {}) {
  if (policyDecision?.allowed !== true || policyDecision?.decision !== "allow_queue_only") {
    return { accepted: false, mode: "dry_run", status: "blocked", reason: "POLICY_NOT_ALLOWED", deliveryAttempted: false };
  }
  if (![campaignId, tenantId, idempotencyKey].every((v) => typeof v === "string" && v.trim())) {
    return { accepted: false, mode: "dry_run", status: "blocked", reason: "CONTEXT_INCOMPLETE", deliveryAttempted: false };
  }
  if (!["sms", "whatsapp", "email"].includes(channel) ||
      !["marketing", "service_updates", "transactional"].includes(purpose)) {
    return { accepted: false, mode: "dry_run", status: "blocked", reason: "CHANNEL_OR_PURPOSE_INVALID", deliveryAttempted: false };
  }

  const keyDigest = createHash("sha256").update(idempotencyKey).digest("hex");
  return Object.freeze({
    accepted: true,
    mode: "dry_run",
    status: "preview_only",
    planId: keyDigest.slice(0, 24),
    tenantId,
    campaignId,
    channel,
    purpose,
    idempotencyDigest: keyDigest,
    payloadIncluded: false,
    destinationIncluded: false,
    persisted: false,
    queued: false,
    deliveryAttempted: false,
  });
}
