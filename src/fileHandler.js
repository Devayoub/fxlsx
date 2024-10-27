const fs = require('fs').promises;

async function readFileAsArrayBuffer(filePath) {
  const data = await fs.readFile(filePath);
  return new Uint8Array(data).buffer;  // Convert to ArrayBuffer
}

module.exports = { readFileAsArrayBuffer };
