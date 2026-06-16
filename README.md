# Writing the Decentralized Web — DappCon 2026 Workshop

Hands-on workshop on **writing** to the decentralized web with [Freedom Browser](https://freedombrowser.eth.limo) — publishing content to Swarm, reading IPFS, signing with the built-in wallet, and resolving via ENS, all through native browser APIs (`window.ethereum` + `window.swarm`).

## Contents

- **`slides/`** — the slide deck. Open `slides/index.html` in any browser.
- **`examples/`** — runnable workshop code:
  - `hands-on-1-publish.js` — publish data to Swarm from the console
  - `hands-on-2-sign.js` — sign metadata with `personal_sign`
  - `feed-update.js` — mutable feeds (`createFeed` / `updateFeed`)
  - `mini-app/` — a self-contained publish + sign mini app
  - `x402/` — native pay-as-you-browse demo (Express + x402)

See [`examples/README.md`](examples/README.md) for prerequisites and run instructions.

## Setup

1. Clone & run Freedom Browser from source — `github.com/solardev-xyz/freedom-browser`
   ```bash
   npm install
   npm run ant:download
   npm run ipfs:download
   npm start
   ```
2. Wait for the Swarm node to connect to 20+ peers.
3. Open `freedombrowser.eth` and create an identity.
4. Clone this workshop repo:
   ```bash
   git clone https://github.com/meinharrd/dappcon-2026.git
   ```

## APIs

- `window.ethereum` — EIP-1193 wallet (`eth_requestAccounts`, `personal_sign`)
- `window.swarm` — experimental Swarm provider (`requestAccess`, `publishData`, `publishFiles`, `createFeed`, `updateFeed`, …)
