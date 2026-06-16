// Hands-on 1 — Publish to Swarm
// Paste this into the Freedom Browser DevTools console (⌥⌘I / Ctrl+Shift+I).
//
// Requires a connected Swarm node with a postage batch (freedom://publish).
// The first call pops a per-origin approval prompt — accept it.

(async () => {
  if (!window.swarm) {
    console.error("window.swarm is missing — open this in Freedom Browser 0.7.4.");
    return;
  }

  // 1. Ask for permission to publish from this origin.
  await window.swarm.requestAccess();

  // 2. Publish a tiny HTML document to Swarm.
  const { reference, bzzUrl } = await window.swarm.publishData({
    data: "<h1>Hello dweb</h1>",
    contentType: "text/html",
    name: "hello.html",
  });

  // 3. Your first content hash — no server, no gateway.
  console.log("reference:", reference);
  console.log("open this:", bzzUrl); // bzz://…

  return { reference, bzzUrl };
})();
