# emulator.bytelabs.online

This project is now a Next.js app using App Router and Emulator.js.

## Stack

- Next.js (App Router)
- React
- Emulator.js loader (CDN)
- Edge API route for streaming ROM files

## Quick Start

1. Install dependencies:

```bash
npm install
```

1. Start development server:

```bash
npm run dev
```

1. Open <http://localhost:3000>

## Game Configuration

All existing games were removed. Add your games in `lib/games.js`.

Each game should include:

- `slug`: URL-safe id (used in `/play/[slug]`)
- `game`: API key slug (used in `/api/rom?game=...` and maps to `ROM_<GAME>`)
- `title`: Display name
- `core`: Emulator.js core (for example `gba`, `nds`, `psx`, `nes`, `snes`)
- `platform`: Human-readable platform label
- `description`: Short text shown in the UI

Set a matching environment variable for each game key:

- `game: "mario"` -> `ROM_MARIO=<onedrive-share-link>`

## ROM Streaming API

The route is implemented at `app/api/rom/route.js` with edge runtime.

- Request format: `/api/rom?game=mario`
- It resolves to `ROM_MARIO`, then streams from OneDrive via the shares API
- Adds `Access-Control-Allow-Origin: *`
- Forwards `Content-Length` when available

## Scripts

- `npm run dev`: Start local dev server
- `npm run build`: Production build
- `npm run start`: Run production build
- `npm run lint`: Run Next.js lint
