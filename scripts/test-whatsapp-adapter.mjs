import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  parseWhatsAppWebhook,
  sendWhatsAppText,
  verifyWhatsAppChallenge,
  verifyWhatsAppSignature
} from "../src/adapters/channels/whatsapp-cloud.mjs";

const secret = "test-app-secret";
const raw = JSON.stringify({
  object: "whatsapp_business_account",
  entry: [{
    changes: [{
      field: "messages",
      value: {
        metadata: { phone_number_id: "123456789012345" },
        contacts: [{ wa_id: "6281234567890", profile: { name: "Test Customer" } }],
        messages: [{
          from: "6281234567890",
          id: "wamid.test-001",
          timestamp: "1791930000",
          type: "text",
          text: { body: "Halo, apakah produk tersedia?" }
        }],
        statuses: [{ id: "wamid.out-001", status: "delivered", timestamp: "1791930001" }]
      }
    }]
  }]
});

const signature = "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
assert.equal(verifyWhatsAppSignature(raw, signature, secret), true, "valid Meta signature accepted");
assert.equal(verifyWhatsAppSignature(raw, signature, "wrong-secret"), false, "wrong secret rejected");
assert.equal(verifyWhatsAppSignature(raw + " ", signature, secret), false, "modified body rejected");
assert.equal(verifyWhatsAppSignature(raw, "sha1=deadbeef", secret), false, "wrong signature format rejected");

const challenge = verifyWhatsAppChallenge(
  "https://example.test/webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=challenge-123",
  "verify-me"
);
assert.deepEqual(challenge, { ok: true, status: 200, challenge: "challenge-123" });
assert.equal(verifyWhatsAppChallenge(
  "https://example.test/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=123",
  "verify-me"
).status, 403);
assert.equal(verifyWhatsAppChallenge("not a URL", "verify-me").status, 400);

const parsed = parseWhatsAppWebhook(JSON.parse(raw));
assert.equal(parsed.messages.length, 1);
assert.equal(parsed.messages[0].providerMessageId, "wamid.test-001");
assert.equal(parsed.messages[0].phoneNumberId, "123456789012345");
assert.equal(parsed.messages[0].senderWaId, "6281234567890");
assert.equal(parsed.messages[0].text, "Halo, apakah produk tersedia?");
assert.equal(parsed.messages[0].profileName, "Test Customer");
assert.equal(parsed.statuses[0].status, "delivered");
assert.equal(parseWhatsAppWebhook({ object: "not-whatsapp", entry: [] }).ignored, true);

await assert.rejects(
  sendWhatsAppText({
    phoneNumberId: "123456789012345",
    to: "6281234567890",
    text: "Hai",
    accessToken: "token",
    graphApiVersion: "v23.0",
    serviceWindowOpen: true,
    customerOptedIn: false,
    fetchImpl: async () => { throw new Error("must not send"); }
  }),
  { message: "WHATSAPP_CUSTOMER_OPT_IN_REQUIRED" }
);
await assert.rejects(
  sendWhatsAppText({
    phoneNumberId: "123456789012345",
    to: "6281234567890",
    text: "Hai",
    accessToken: "token",
    graphApiVersion: "v23.0",
    serviceWindowOpen: false,
    customerOptedIn: true,
    fetchImpl: async () => { throw new Error("must not send"); }
  }),
  { message: "WHATSAPP_TEMPLATE_REQUIRED_OUTSIDE_SERVICE_WINDOW" }
);

let requestCaptured;
const sent = await sendWhatsAppText({
  phoneNumberId: "123456789012345",
  to: "6281234567890",
  text: " Hai ",
  accessToken: "fake-test-token",
  graphApiVersion: "v23.0",
  serviceWindowOpen: true,
  customerOptedIn: true,
  fetchImpl: async (url, init) => {
    requestCaptured = { url, init };
    return new Response(JSON.stringify({
      messages: [{ id: "wamid.provider-123" }],
      contacts: [{ wa_id: "6281234567890" }]
    }), { status: 200, headers: { "content-type": "application/json" } });
  }
});
assert.equal(sent.providerMessageId, "wamid.provider-123");
assert.equal(requestCaptured.url, "https://graph.facebook.com/v23.0/123456789012345/messages");
assert.equal(JSON.parse(requestCaptured.init.body).text.body, "Hai");
assert.equal(requestCaptured.init.headers.authorization, "Bearer fake-test-token");

console.log("WhatsApp adapter contract tests passed.");
