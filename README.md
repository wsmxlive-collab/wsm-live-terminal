# WSM Live

A lightweight Astro site for global financial market monitoring with TradingView embeds and live data fallbacks.

## Local Development

1. Copy the example env file:

```bash
cd C:\Project\wsm\celestial-chasm
copy .env.example .env
```

2. Fill in your keys in `celestial-chasm\.env`:

```text
FINNHUB_API_KEY=your_finnhub_api_key
DISQUS_SHORTNAME=your_disqus_shortname
```

3. Install dependencies and start dev server:

```bash
cd celestial-chasm
npm install
npm run dev
```

4. Open the local dev URL printed by Astro.

## Deployment (Cloudflare Pages)

1. Create a GitHub repository and push the `wsm` project root.
2. In Cloudflare Pages, connect the GitHub repo and set the project root to `celestial-chasm`.
3. Set environment variables in Cloudflare Pages:

- `FINNHUB_API_KEY`
- `DISQUS_SHORTNAME`

4. Build command:

```bash
npm install
npm run build
```

5. Publish directory:

```text
dist
```

6. Add custom domain `wsmlive.com` in the Pages project settings.

## Secure Key Rotation

- Do not commit `.env` or secrets to GitHub.
- To rotate keys, update the Cloudflare Pages environment variables and local `.env` file.
- Use `.env.example` for local placeholder configuration.
