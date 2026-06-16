// x402 demo server — a single paywalled endpoint.
//
// Freedom Browser pays for x402 resources transparently: when a request
// gets a 402 with a PAYMENT-REQUIRED header, the browser shows an approval card,
// signs a (gasless) stablecoin authorization, and retries — no client SDK needed.
//
// This server is the OTHER side: it issues those 402 challenges.
//
//   npm install
//   npm start            # http://localhost:4021
//
// Then open http://localhost:4021/ in Freedom Browser and request the premium
// content. Uses Base Sepolia testnet (eip155:84532).

import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

// Where settlements should be paid. Replace with your testnet receiving address.
const PAY_TO = process.env.PAY_TO || "0x0000000000000000000000000000000000000000";
const NETWORK = "eip155:84532"; // Base Sepolia
const PORT = process.env.PORT || 4021;

const app = express();

// Allow this page to be hosted anywhere (Swarm, file, another port) and still
// reach the paid endpoint cross-origin. Runs before the payment middleware so
// the CORS preflight is never paywalled.
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Accept, Content-Type, X-PAYMENT, PAYMENT-SIGNATURE");
  res.set("Access-Control-Expose-Headers", "PAYMENT-REQUIRED, X-PAYMENT-REQUIRED, PAYMENT-RESPONSE, X-PAYMENT-RESPONSE");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// The facilitator verifies and settles payments so we don't run chain infra.
const facilitator = new HTTPFacilitatorClient({ url: "https://facilitator.x402.org" });
const resourceServer = new x402ResourceServer(facilitator).register(NETWORK, new ExactEvmScheme());

// Protect GET /premium behind a $0.01 payment.
app.use(
  paymentMiddleware(
    {
      "GET /premium": {
        accepts: { scheme: "exact", price: "$0.01", network: NETWORK, payTo: PAY_TO },
        description: "One premium fact, paid per request",
      },
    },
    resourceServer,
  ),
);

// The protected resource — only served once payment is verified.
app.get("/premium", (req, res) => {
  res.json({
    paid: true,
    fact: "Swarm and IPFS are content-addressed: the hash is the identity of the data.",
    servedAt: new Date().toISOString(),
  });
});

// Serve the demo client (index.html) from this folder.
app.use(express.static(new URL(".", import.meta.url).pathname));

app.listen(PORT, () => {
  console.log(`x402 demo server on http://localhost:${PORT}`);
  console.log(`  paid endpoint:  GET /premium  ($0.01 on ${NETWORK})`);
  console.log(`  paying to:      ${PAY_TO}`);
});
