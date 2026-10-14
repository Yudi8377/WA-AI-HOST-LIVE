import assert from "node:assert/strict";
import { sendAdminNotification } from "../functions/whatsapp-adapter/send-admin-notification.mjs";

for (const key of ["WA_ADMIN_PHONE", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_API_VERSION"]) {
  delete process.env[key];
}
assert.deepEqual(await sendAdminNotification("test"), { ok: false, reason: "not_configured" });

process.env.WA_ADMIN_PHONE = "628123456789";
process.env.WHATSAPP_PHONE_NUMBER_ID = "1234567890";
process.env.WHATSAPP_ACCESS_TOKEN = "test-token";
process.env.WHATSAPP_API_VERSION = "v99.0";

let requestSeen;
const result = await sendAdminNotification("Pesan uji internal", async (url, init) => {
  requestSeen = { url, init };
  return new Response(JSON.stringify({ messages: [{ id: "wamid.test" }] }), { status: 200 });
});
assert.equal(result.ok, true);
assert.equal(result.messageId, "wamid.test");
assert.equal(requestSeen.init.method, "POST");
assert.equal(JSON.parse(requestSeen.init.body).to, "628123456789");
assert.equal(requestSeen.init.headers.authorization, "Bearer test-token");

const rejected = await sendAdminNotification("test", async () =>
  new Response(JSON.stringify({ error: { message: "sensitive provider error" } }), { status: 400 })
);
assert.deepEqual(rejected, { ok: false, reason: "provider_rejected", status: 400 });

console.log("WhatsApp adapter configuration and provider-response tests passed.");
