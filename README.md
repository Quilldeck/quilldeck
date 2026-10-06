# Quilldeck

**The AI-powered mobile publishing and marketing toolkit for independent authors — built natively for Solana Seeker.**

> Publish Smarter. Market Faster. Own Your Career.

Built for [CLOCK IN — The Solana Mobile Hackathon](https://solanamobile.com/hackathon) (September–October 2026).

---

## What it does

Authors write their books elsewhere (Scrivener, Google Docs, Word). Quilldeck picks up where the writing ends — when the manuscript is done and the author needs to prepare it for publication and market it.

Quilldeck is **not** a writing tool, a manuscript editor, or a formatting tool. It's a publishing and marketing toolkit that lives on your phone.

### Core features

- **AI Blurb Generator** — enter a book's title, genre, and synopsis; get three distinct, genre-aware blurb variants (Emotional, Action, and Mystery hooks), ready to paste into a KDP listing. Confirmed working end-to-end on a physical Solana Seeker device: app → Vercel backend → Groq API → back to the device.
- **"Go Market This"** — a single tap that generates a complete marketing package: social posts, email drafts (pre-launch, launch day, post-launch), Amazon ad copy variants with keywords, a 14-day posting calendar, and curated promo site recommendations. Confirmed working end-to-end on a physical Solana Seeker device, tested against a real book (*The Silent One*).

### Roadmap (not yet in this build)

- Solana Pay / Mobile Wallet Adapter / Seed Vault integration for USDC subscription payments. An earlier scaffold (`@wallet-ui/react-native-kit`) was never wired into the app — nothing outside the scaffold's own files imported it — and has since been removed rather than left as dead code. A mock subscription screen that faked a transaction hash was removed for the same reason: v1.0 doesn't advertise a payment flow it doesn't have. Real Solana Pay integration is scoped as the next build phase.
- KDP Metadata Helper, Book Project Dashboard, Launch Checklist Engine

v1.0 is intentionally free of any subscription or paywall UI — there's nothing to unlock yet, so nothing pretends to gate anything.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) |
| Backend | Vercel serverless functions |
| Database | Supabase (Postgres + Auth + Storage) |
| AI generation | Groq API (Llama 3.3 70B) |
| Target hardware | Solana Seeker (Android) |

## Running it locally

```bash
# Install dependencies
npm install

# Start the Expo dev server
npx expo start

# Build and run a development client on a connected Android device
npx expo run:android
```

The backend lives in `quilldeck-api` and is deployed separately on Vercel; see `vercel.json` for configuration. You'll need your own Groq and Supabase API keys in a local `.env` file to run the backend.

## Project structure

```
quilldeck/
├── app/            # Expo Router screens
├── components/     # Shared UI components
├── constants/       # Design tokens, config
├── features/        # Feature modules (blurb generator, marketing package, etc.)
├── src/             # Core app logic
├── utils/            # Helpers
└── quilldeck-api/    # Vercel serverless backend
```

## About Quilldeck

Quilldeck is built by [Phoenix F. Black](https://quilldeck.app), founder of [Iroko Tree Press](https://www.irokotreepress.com) and CEO of Taoscope Labs Ltd — an independent publisher building the tool he needed himself while launching his own book, *The Silent One*, through the same broken indie-author toolkit Quilldeck exists to fix.

- Web: [quilldeck.app](https://quilldeck.app)
- X: [@quilldeck0](https://x.com/quilldeck0)

## License

MIT
