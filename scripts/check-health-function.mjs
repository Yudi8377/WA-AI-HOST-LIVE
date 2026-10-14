import assert from "node:assert/strict";
import health from "../neon/functions/health/index.mjs";

const allowed = "https://yudi8377.github.io";
const get = await health.fetch(new Request("https://health.test/", {
  method: "GET",
  headers: { origin: allowed },
}));
assert.equal(get.status, 200);
assert.equal(get.headers.get("cache-control"), "no-store");
assert.equal(get.headers.get("access-control-allow-origin"), allowed);
const payload = await get.json();
assert.equal(payload.status, "degraded");
assert.equal(payload.environment, "production");
assert.equal(payload.checks.authenticated_api, "not_deployed");
assert.equal(payload.checks.runtime_database_role, "not_configured");

const head = await health.fetch(new Request("https://health.test/", {
  method: "HEAD",
  headers: { origin: allowed },
}));
assert.equal(head.status, 200);
assert.equal(await head.text(), "");

const post = await health.fetch(new Request("https://health.test/", { method: "POST" }));
assert.equal(post.status, 405);
assert.equal(post.headers.get("allow"), "GET, HEAD, OPTIONS");

const preflightAllowed = await health.fetch(new Request("https://health.test/", {
  method: "OPTIONS",
  headers: { origin: allowed },
}));
assert.equal(preflightAllowed.status, 204);

const preflightDenied = await health.fetch(new Request("https://health.test/", {
  method: "OPTIONS",
  headers: { origin: "https://attacker.example" },
}));
assert.equal(preflightDenied.status, 403);
assert.notEqual(preflightDenied.headers.get("access-control-allow-origin"), "*");

console.log("Production health function contract checks passed.");
