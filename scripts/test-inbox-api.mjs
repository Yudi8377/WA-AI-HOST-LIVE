import assert from "node:assert/strict";
import handler from "../functions/inbox-api/index.mjs";

process.env.ALLOWED_ORIGIN = "https://example.test";
delete process.env.NEON_AUTH_BASE_URL;
delete process.env.WA_APP_DATABASE_URL;

const health = await handler.fetch(new Request("https://function.test/api/health"));
assert.equal(health.status, 200);
assert.equal(health.headers.get("cache-control"), "no-store, max-age=0");
assert.equal((await health.json()).status, "ok");

const deniedOrigin = await handler.fetch(new Request("https://function.test/api/session/tenants", {
  method: "GET",
  headers: { origin: "https://attacker.test" },
}));
assert.equal(deniedOrigin.status, 403);

const unauthenticated = await handler.fetch(new Request("https://function.test/api/session/tenants", {
  method: "GET",
  headers: { origin: "https://example.test" },
}));
assert.equal(unauthenticated.status, 401);

const preflight = await handler.fetch(new Request("https://function.test/api/session/tenants", {
  method: "OPTIONS",
  headers: { origin: "https://example.test" },
}));
assert.equal(preflight.status, 204);
assert.equal(preflight.headers.get("access-control-allow-origin"), "https://example.test");

console.log("Inbox API fail-closed smoke tests passed.");
