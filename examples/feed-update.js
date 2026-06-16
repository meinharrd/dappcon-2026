// Upside — Mutable feeds
// A Swarm reference is immutable. A feed is a stable pointer you can update,
// so "profile.eth" or "my-blog" can always resolve to your latest content.
// Paste into the console (requires a connected Swarm node + postage).

(async () => {
  if (!window.swarm) {
    console.error("window.swarm is missing — open this in Freedom Browser.");
    return;
  }

  await window.swarm.requestAccess();

  const topic = "dappcon-demo-feed";

  // 1. Publish some content and get a reference.
  const v1 = await window.swarm.publishData({
    data: "<h1>Post v1</h1>",
    contentType: "text/html",
    name: "post.html",
  });

  // 2. Point a feed at it.
  await window.swarm.createFeed({ topic });
  await window.swarm.updateFeed({ topic, reference: v1.reference });
  console.log("feed -> v1:", v1.reference);

  // 3. Publish new content and move the feed. The pointer stays stable.
  const v2 = await window.swarm.publishData({
    data: "<h1>Post v2 — updated</h1>",
    contentType: "text/html",
    name: "post.html",
  });
  await window.swarm.updateFeed({ topic, reference: v2.reference });
  console.log("feed -> v2:", v2.reference);

  // 4. Read the latest entry back.
  const identity = await window.swarm.getSigningIdentity();
  const latest = await window.swarm.readFeedEntry({ topic, owner: identity.address });
  console.log("feed now resolves to:", latest);

  return latest;
})();
