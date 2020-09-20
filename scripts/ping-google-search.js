// This script will simply ping google js
const fetch = require("node-fetch");

(async () => {
  console.log("---- Pinging Google with the new sitemap ----");
  await fetch(
    "http://www.google.com/ping?sitemap=https://puruvj.dev/sitemap.xml"
  );
  console.log('---- Pinging Google Done ----')
})();
