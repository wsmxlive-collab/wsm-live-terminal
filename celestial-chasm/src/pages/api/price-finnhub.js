const CACHE_TTL = 15 * 1000; // 15 seconds
const cache = global.__PRICE_CACHE_FH || (global.__PRICE_CACHE_FH = new Map());

export async function GET({ url }) {
  const symbol = url.searchParams.get('symbol');
  if (!symbol) return new Response(JSON.stringify({ error: 'missing symbol' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  const key = process.env.FINNHUB_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: 'missing FINNHUB_API_KEY in env' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  const cacheKey = `fh:${symbol}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.ts) < CACHE_TTL) {
    return new Response(JSON.stringify({ provider: 'finnhub', price: cached.price, raw: cached.raw, cached: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(key)}`);
    if (!res.ok) return new Response(JSON.stringify({ error: 'provider error', status: res.status }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    const j = await res.json();
    const price = typeof j.c === 'number' ? j.c : (j.c ? Number(j.c) : null);
    cache.set(cacheKey, { ts: now, price, raw: j });
    return new Response(JSON.stringify({ provider: 'finnhub', price, raw: j }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
