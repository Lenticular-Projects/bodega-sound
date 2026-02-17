const fs = require('fs');
const path = require('path');

const nftPath = path.join(process.cwd(), '.next/server/middleware.js.nft.json');

if (!fs.existsSync(nftPath)) {
  console.log('Creating missing middleware.js.nft.json...');
  fs.writeFileSync(nftPath, JSON.stringify({
    version: 1,
    files: []
  }));
}
