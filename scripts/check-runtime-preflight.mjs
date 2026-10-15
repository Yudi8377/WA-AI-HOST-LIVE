#!/usr/bin/env node
import assert from "node:assert/strict";

const REQUIRED = [
  "DATABASE_URL",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_VERIFY_TOKEN",
  "WHATSAPP_APP_SECRET",
  "WHATSAPP_GRAPH_API_VERSION"
];

export function evaluateRuntimeEnvironment(env) {
  const blockers = [];
  const missing = REQUIRED.filter((key) => !String(env[key] ?? "").trim());
  if (missing.length) blockers.push(`Missing required variables: ${missing.join(", ")}`);

  const databaseUrl = String(env.DATABASE_URL ?? "");
  if (databaseUrl && !/^postgres(?:ql)?:\/\//i.test(databaseUrl)) {
    blockers.push("DATABASE_URL must use a postgres:// or postgresql:// URL.");
  }

  const graphVersion = String(env.WHATSAPP_GRAPH_API_VERSION ?? "");
  if (graphVersion && !/^v\d+\.\d+$/.test(graphVersion)) {
    blockers.push("WHATSAPP_GRAPH_API_VERSION must match the reviewed format vNN.N.");
  }

  if (env.WHATSAPP_WEBHOOK_ENABLED !== "true") {
    blockers.push("WHATSAPP_WEBHOOK_ENABLED is not exactly true; webhook remains safely disabled.");
  }

  return {
    ready: blockers.length === 0,
    webhookEnabled: env.WHATSAPP_WEBHOOK_ENABLED === "true",
    missing,
    blockers
  };
}

function selfTest() {
  const absent = evaluateRuntimeEnvironment({});
  assert.equal(absent.ready, false);
  assert.equal(absent.webhookEnabled, false);
  assert.ok(absent.blockers.some((item) => item.includes("WHATSAPP_WEBHOOK_ENABLED")));

  const valid = evaluateRuntimeEnvironment({
    DATABASE_URL: "postgresql://runtime:example@db.example.test/app",
    WHATSAPP_ACCESS_TOKEN: "not-printed",
    WHATSAPP_PHONE_NUMBER_ID: "123456789",
    WHATSAPP_VERIFY_TOKEN: "not-printed",
    WHATSAPP_APP_SECRET: "not-printed",
    WHATSAPP_GRAPH_API_VERSION: "v99.0",
    WHATSAPP_WEBHOOK_ENABLED: "true"
  });
  assert.equal(valid.ready, true);
  assert.deepEqual(valid.blockers, []);

  const invalid = evaluateRuntimeEnvironment({
    DATABASE_URL: "https://not-a-database.example",
    WHATSAPP_GRAPH_API_VERSION: "latest",
    WHATSAPP_WEBHOOK_ENABLED: "true"
  });
  assert.equal(invalid.ready, false);
  assert.ok(invalid.blockers.some((item) => item.includes("DATABASE_URL")));
  assert.ok(invalid.blockers.some((item) => item.includes("GRAPH_API_VERSION")));

  console.log("Runtime preflight self-tests passed; secret values are never included in output.");
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const result = evaluateRuntimeEnvironment(process.env);
  console.log(`Configuration preflight: ${result.ready ? "PASS" : "BLOCKED"}`);
  console.log(`WhatsApp webhook enabled: ${result.webhookEnabled ? "yes" : "no"}`);
  for (const blocker of result.blockers) console.log(`- ${blocker}`);
  console.log("This checks environment configuration only; it does not test DB permissions, Meta approval, network reachability, or end-to-end message delivery.");
  if (process.argv.includes("--strict") && !result.ready) process.exitCode = 1;
}
