/**
 * Cloudflare Worker — Yahoo Finance CORS proxy
 * Forwards requests to Yahoo Finance and adds CORS headers.
 *
 * Usage:  GET /?url=https://query1.finance.yahoo.com/...
 */

const ALLOWED_HOSTS = ['finance.yahoo.com', 'open.er-api.com'];

export default {
  async fetch(request) {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const incoming = new URL(request.url);
    const target   = incoming.searchParams.get('url');

    if (!target) {
      return json({ error: 'Missing ?url= parameter' }, 400);
    }

    // Only proxy Yahoo Finance to prevent abuse
    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return json({ error: 'Invalid URL' }, 400);
    }

    if (!ALLOWED_HOSTS.some(h => targetUrl.hostname.endsWith(h))) {
      return json({ error: 'Only Yahoo Finance URLs are allowed' }, 403);
    }

    try {
      const upstream = await fetch(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept':     'application/json',
        },
        cf: { cacheTtl: 30, cacheEverything: true },
      });

      const body = await upstream.text();

      return new Response(body, {
        status:  upstream.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      });
    } catch (e) {
      return json({ error: 'Upstream fetch failed', detail: e.message }, 502);
    }
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}
