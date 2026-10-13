export default {
  async fetch(request) {
    const headers = {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, HEAD, OPTIONS",
      "access-control-allow-headers": "content-type, authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), {
        status: 405,
        headers: { ...headers, allow: "GET, HEAD, OPTIONS" }
      });
    }

    const payload = JSON.stringify({
      service: "WA AI HOST LIVE",
      status: "ok",
      environment: "development",
      apiVersion: "v1"
    });
    return new Response(request.method === "HEAD" ? null : payload, {
      status: 200,
      headers
    });
  }
};
