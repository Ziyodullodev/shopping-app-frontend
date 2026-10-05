# Shopping App — Frontend

Telegram Mini App for a shoe shop, built with React 19, TypeScript and Vite from the
"Mobile - Shopping App UI (Community)" Figma design. Backend: [shopping-app-backend](https://github.com/Ziyodullodev/shopping-app-backend).

## Run locally

Start the backend first (it listens on `127.0.0.1:8010`), then:

```bash
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` and `/media` to the backend.
With `TELEGRAM_DEV_AUTH=true` in the backend `.env` the app works in a normal browser as a "Dev User".
Without it, the app shows an "Open in Telegram" screen outside Telegram.

## Open it inside Telegram

Telegram only loads Mini Apps over HTTPS. During development expose the Vite server with a tunnel:

```bash
cloudflared tunnel --url http://localhost:5173
```

Then in @BotFather: `/mybots` → your bot → Bot Settings → Menu Button (or `/newapp`) and paste the HTTPS URL.

## Environment

Copy `.env.example` to `.env`.

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend API base for production builds, e.g. `https://api.example.com/api`. Empty uses the dev proxy. |
| `VITE_BOT_URL` | `https://t.me/your_bot`, shown when the app is opened outside Telegram. |

## Screens

| Route | Screen |
| --- | --- |
| `/` | Onboarding (3 slides, shown once) |
| `/home` | Products, brand filter, sort |
| `/product/:slug` | Product detail with size picker |
| `/cart` | Cart with quantity controls |
| `/checkout` | Contact, address, payment method |
| `/orders` | Order history with cancel |
| `/wishlist` | Saved products |
| `/search` | Search by name or brand |
| `/profile` | Telegram profile and menu |

## Structure

- `src/lib/telegram.ts` Telegram WebApp SDK wrapper: init, BackButton, haptics, safe areas.
- `src/lib/api.ts` API client. Logs in with Telegram `initData` and retries once on 401.
- `src/context/Store.tsx` user, cart and wishlist state with optimistic updates and a request queue.
- `src/pages/` one file per screen, `src/components/` shared UI.
- `src/index.css` design tokens at the top.

Products without an uploaded photo are drawn as SVG sneakers using the `look` colours from the API.

## Build

```bash
npm run build
```

Serve `dist/` from any static host with HTTPS and an SPA fallback to `index.html`.
