# Workshop examples — Writing the dweb

Runnable code for the DappCon "Writing the dweb" workshop, targeting **Freedom Browser 0.7.4**.

Everything here uses the two providers Freedom injects into every page:

- `window.ethereum` — EIP-1193 wallet (identity, signing, transactions)
- `window.swarm` — experimental Swarm provider (publish, feeds, chunks), gated by a per-origin approval prompt

> All of this only works **inside Freedom Browser**. Opening these files in Chrome/Safari
> will report that the APIs are missing.

## Prerequisites

1. Clone and run Freedom Browser 0.7.4 from source:
   ```bash
   git clone https://github.com/solardev-xyz/freedom-browser
   cd freedom-browser
   npm install
   npm run ant:download && npm run ipfs:download
   npm start
   ```
2. Wait for the Swarm node to connect to 20+ nodes (Nodes panel)
3. Create a test wallet identity (Settings → Experimental → Identity & Wallet)
4. **For publishing only:** a connected Swarm node with a postage batch
   (`freedom://publish`). Reading and signing need none of this.

## What's here

| File | Segment | How to run |
| --- | --- | --- |
| `hands-on-1-publish.js` | Hands-on 1 · publish to Swarm | Paste into the DevTools console (⌥⌘I / Ctrl+Shift+I) |
| `hands-on-2-sign.js` | Hands-on 2 · sign metadata | Paste into the console after step 1 |
| `feed-update.js` | Upside · mutable feeds | Paste into the console |
| `mini-app/index.html` | Mini app · clone, run, modify | Open the file in Freedom Browser |
| `x402/` | Upside · pay as you browse | `cd x402 && npm install && npm start`, then open `http://localhost:4021/` in Freedom Browser |

## The flow

```
connect wallet            window.ethereum
  → create content
  → publish to Swarm       window.swarm.publishData → { reference, bzzUrl }
  → sign metadata          window.ethereum personal_sign
  → open / resolve         bzz://… · ENS
```

## API quick reference (0.7.4)

```js
// Wallet
const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
const sig = await window.ethereum.request({ method: "personal_sign", params: [message, account] });

// Swarm — must requestAccess() first (per-origin approval prompt)
await window.swarm.requestAccess();                 // → { connected, origin, capabilities }
await window.swarm.getCapabilities();
await window.swarm.publishData({ data, contentType, name });  // → { reference, bzzUrl }
await window.swarm.createFeed({ topic });
await window.swarm.updateFeed({ topic, reference });
await window.swarm.readFeedEntry({ topic, owner });
await window.swarm.getSigningIdentity();
```

## x402 — pay as you browse

Freedom 0.7.4 settles x402 payments **transparently**: a paywalled request returns
`402` with a `PAYMENT-REQUIRED` header, the browser shows an approval card, signs a
gasless stablecoin authorization, attaches `PAYMENT-SIGNATURE`, and retries. The page
just calls `fetch()` — **no x402 client SDK**. Payments are visible at `freedom://payments`.

The `x402/` example has both sides: a tiny `@x402/express` server (`server.js`) that
paywalls `GET /premium`, and a client (`index.html`) that fetches it. Defaults to
Base Sepolia testnet (`eip155:84532`); set `PAY_TO` to your receiving address.
