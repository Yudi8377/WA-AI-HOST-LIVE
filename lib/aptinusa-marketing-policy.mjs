const REQUIRED_TRUE_FLAGS = [
  ["destinationProvidedByContact", "DESTINATION_SOURCE_UNVERIFIED"],
  ["destinationVerified", "DESTINATION_UNVERIFIED"],
  ["providerConfigured", "PROVIDER_NOT_CONFIGURED"],
  ["providerAuthorized", "PROVIDER_NOT_AUTHORIZED"],
  ["campaignApproved", "CAMPAIGN_NOT_APPROVED"],
  ["spendWithinLimit", "SPEND_LIMIT_EXCEEDED"],
  ["quietHoursAllowed", "QUIET_HOURS_BLOCK"],
  ["frequencyAllowed", "FREQUENCY_CAP_REACHED"],
  ["liveMessagingEnabled", "LIVE_MESSAGING_DISABLED"],
];

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Fail-closed policy decision only. This function never sends a message.
 * Call immediately before queueing, and re-check consent/suppression in the worker.
 */
export function evaluateMarketingSend(input = {}) {
  const reasons = [];
  const channel = input.channel;
  const purpose = input.purpose;

  if (!nonEmpty(input.actorTenantId) || !nonEmpty(input.campaignTenantId) ||
      !nonEmpty(input.contactTenantId) || !nonEmpty(input.contactId)) {
    reasons.push("TENANT_OR_CONTACT_CONTEXT_MISSING");
  } else if (
    input.actorTenantId !== input.campaignTenantId ||
    input.contactTenantId !== input.campaignTenantId
  ) {
    reasons.push("TENANT_SCOPE_MISMATCH");
  }

  if (!["sms", "whatsapp", "email"].includes(channel)) reasons.push("CHANNEL_INVALID");
  if (!["marketing", "service_updates", "transactional"].includes(purpose)) reasons.push("PURPOSE_INVALID");

  const consent = input.consent;
  if (!consent || consent.active !== true || consent.revokedAt != null) {
    reasons.push("CONSENT_INACTIVE_OR_REVOKED");
  } else {
    if (consent.tenantId !== input.campaignTenantId || consent.contactId !== input.contactId) {
      reasons.push("CONSENT_SCOPE_MISMATCH");
    }
    if (consent.channel !== channel) reasons.push("CONSENT_CHANNEL_MISMATCH");
    if (consent.purpose !== purpose) reasons.push("CONSENT_PURPOSE_MISMATCH");
    if (!nonEmpty(consent.capturedAt) || !nonEmpty(consent.noticeVersion) || !nonEmpty(consent.source)) {
      reasons.push("CONSENT_EVIDENCE_INCOMPLETE");
    }
  }

  if (input.suppressed !== false) reasons.push("DESTINATION_SUPPRESSED_OR_STATUS_UNKNOWN");

  for (const [flag, reason] of REQUIRED_TRUE_FLAGS) {
    if (input[flag] !== true) reasons.push(reason);
  }

  if (!nonEmpty(input.idempotencyKey)) reasons.push("IDEMPOTENCY_KEY_MISSING");

  return {
    allowed: reasons.length === 0,
    reasonCodes: [...new Set(reasons)],
    decision: reasons.length === 0 ? "allow_queue_only" : "deny",
    messageSent: false,
  };
}
