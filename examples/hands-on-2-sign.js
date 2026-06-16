// Hands-on 2 — Sign metadata
// Storage gives you content; the wallet gives you authorship.
// Paste into the console. Replace `reference` / `bzzUrl` with the values
// you got from hands-on 1 (or run publish again here).

(async () => {
  if (!window.ethereum) {
    console.error("window.ethereum is missing — open this in Freedom Browser 0.7.4.");
    return;
  }

  // Reuse your published content, or publish fresh:
  let reference = "<paste-your-reference>";
  let bzzUrl = "<paste-your-bzz-url>";
  if (reference.startsWith("<") && window.swarm) {
    await window.swarm.requestAccess();
    ({ reference, bzzUrl } = await window.swarm.publishData({
      data: "<h1>Hello dweb</h1>",
      contentType: "text/html",
      name: "hello.html",
    }));
  }

  // 1. Connect the wallet.
  const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });

  // 2. Wrap the content in metadata.
  const metadata = {
    title: "My first dweb post",
    reference,
    bzzUrl,
    author: account,
    timestamp: new Date().toISOString(),
  };

  // 3. Sign it. personal_sign opens the wallet approval screen.
  const message = JSON.stringify(metadata);
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [message, account],
  });

  // Portable, provable: anyone can verify `account` signed this exact metadata.
  console.log("metadata:", metadata);
  console.log("signature:", signature);

  return { metadata, signature };
})();
