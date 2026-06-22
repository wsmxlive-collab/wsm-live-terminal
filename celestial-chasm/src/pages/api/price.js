export async function get({ request }) {
  try {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol');
    if (!symbol) return new Response(JSON.stringify({ price: null }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    let price = null;

    if (symbol.startsWith('BINANCE:')) {
      const s = symbol.split(':')[1];
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(s)}`);
      if (res.ok) {
        const j = await res.json();
        price = Number(j.price);
      }
    } else if (symbol.startsWith('BITFINEX:')) {
      const pair = symbol.split(':')[1];
      const apiSym = 't' + pair.replace('/', '');
      const res = await fetch(`https://api-pub.bitfinex.com/v2/ticker/${apiSym}`);
      if (res.ok) {
        const j = await res.json();
        price = Number(j[6]);
      }
    } else if (symbol.startsWith('COINGECKO:')) {
      const id = symbol.split(':')[1];
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`);
      if (res.ok) {
        const j = await res.json();
        price = j && j[id] && j[id].usd ? Number(j[id].usd) : null;
      }
    } else {
      const mapping = {
        'TVC:GOLD': 'GC=F',
        'TVC:SILVER': 'SI=F',
        'COMEX:HG1!': 'HG=F',
        'NYMEX:CL1!': 'CL=F',
        'NYMEX:NG1!': 'NG=F',
        'TVC:DJI': '^DJI',
        'NSE:NIFTY': '^NSEI',
        '^GSPC': '^GSPC',
        '^N225': '^N225',
        '^HSI': '^HSI',
        '^GDAXI': '^GDAXI',
        '^FCHI': '^FCHI'
      };
      const yahooSymbol = mapping[symbol];
      if (yahooSymbol) {
        const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(yahooSymbol)}`);
        if (res.ok) {
          const j = await res.json();
          const quote = j?.quoteResponse?.result?.[0];
          if (quote && typeof quote.regularMarketPrice === 'number') {
            price = Number(quote.regularMarketPrice);
          }
        }
      }
    }

    return new Response(JSON.stringify({ price }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ price: null, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
