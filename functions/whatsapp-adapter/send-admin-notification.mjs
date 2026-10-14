/**
 * Server-side WhatsApp Cloud API adapter.
 * This module does not expose an HTTP endpoint. Call it only from authenticated,
 * rate-limited server-side workflows after authorization and opt-in checks.
 */
const normalizePhone = (value) => {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
};

export async function sendAdminNotification(message, fetchImpl = fetch) {
  const recipient = normalizePhone(process.env.WA_ADMIN_PHONE);
  const senderId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const version = process.env.WHATSAPP_API_VERSION;

  if (!recipient || !senderId || !token || !version) {
    return { ok: false, reason: "not_configured" };
  }
  if (typeof message !== "string" || message.trim().length === 0 || message.length > 1500) {
    return { ok: false, reason: "invalid_message" };
  }
  if (!/^v\d+\.\d+$/.test(version)) {
    return { ok: false, reason: "invalid_api_version" };
  }

  const endpoint = `https://graph.facebook.com/${version}/${encodeURIComponent(senderId)}/messages`;
  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: { preview_url: false, body: message.trim() },
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return { ok: false, reason: "provider_unreachable" };
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    // Never return provider body, token, or personal recipient to callers/logs.
    return { ok: false, reason: "provider_rejected", status: response.status };
  }
  const messageId = payload?.messages?.[0]?.id;
  if (typeof messageId !== "string") {
    return { ok: false, reason: "provider_response_unexpected" };
  }
  return { ok: true, messageId };
}
