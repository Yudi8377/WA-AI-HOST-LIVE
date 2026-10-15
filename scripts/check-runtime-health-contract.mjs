import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../api/runtime-health.ts", import.meta.url), "utf8");
for (const contract of [
  "DATABASE_URL",
  "SET LOCAL ROLE wa_app_runtime_safe",
  "rolbypassrls",
  "rolsuper",
  "rolcreaterole",
  "rolcreatedb",
  "neon_superuser",
  "cache-control",
  "not_ready",
  "leastPrivilegeRole",
]) assert.ok(source.includes(contract), `missing runtime health contract: ${contract}`);

assert.ok(source.includes("res.statusCode = 503"), "readiness failures must return 503");
assert.ok(source.includes("res.statusCode = 405"), "unsupported methods must be rejected");
assert.ok(source.includes("catch {"), "errors must be handled without leaking details");
assert.ok(!source.includes("console.log("), "health endpoint must not log sensitive diagnostics");
console.log("Runtime health readiness contract passed.");
