const allowedOrigin = "https://yudi8377.github.io";

export default {
  async fetch(request) {
    const origin = request.headers.get("origin");
    const headers = {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "access-control-allow-methods": "GET, HEAD, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      ...(origin === allowedOrigin
        ? { "access-control-allow-origin": allowedOrigin, vary: "Origin" }
        : {})
    };

    if (request.method === "OPTIONS") {
      if (origin && origin !== allowedOrigin) {
        return new Response(null, { status: 403, headers });
      }
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), {
        status: 405,
        headers: { ...headers, allow: "GET, HEAD, OPTIONS" }
      });
    }

    const payload = {
      service: "Aptinusa / WA AI HOST LIVE",
      status: "degraded",
      environment: "production",
      apiVersion: "v1",
      checks: {
        database_schema: "present_rls_enabled",
        authenticated_api: "not_deployed",
        runtime_database_role: "not_configured",
        customer_messaging: "not_configured",
        public_website: "pending_github_pages_enablement"
      },
      message:
        "Health endpoint is live. Customer-facing APIs and messaging are intentionally disabled until authentication, least-privilege database access, and tenant-isolation tests pass."
    };

    return new Response(
      request.method === "HEAD" ? null : JSON.stringify(payload),
      { status: 200, headers }
    );
  }
};
