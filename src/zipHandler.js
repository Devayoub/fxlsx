const JSZip = require("jszip");

async function decompressZIP(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const zipEntries = [];

  zip.forEach((relativePath, file) => {
    console.log("Found file:", relativePath); // Log each file path
    zipEntries.push({ name: relativePath, content: file }); // Push file itself as content
  });

  return zipEntries;
}

module.exports = { decompressZIP };
