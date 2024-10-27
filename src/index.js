const { readFileAsArrayBuffer } = require('./fileHandler');
const { decompressZIP } = require('./zipHandler');
const { parseXMLWithSAX } = require('./xmlParser');


function parseSharedStrings(xmlString) {
  const sax = require('sax');
  const parser = sax.parser(true);
  const sharedStrings = [];
  let currentString = '';

  parser.onopentag = function (node) {
    if (node.name === 't') {
      currentString = ''; // Reset for new string
    }
  };

  parser.ontext = function (text) {
    currentString += text;
  };

  parser.onclosetag = function (tagName) {
    if (tagName === 't') {
      sharedStrings.push(currentString); // Add completed string
      currentString = '';
    }
  };

  parser.write(xmlString).close();
  return sharedStrings;
}


async function fxlsx(filePath) {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(filePath);
    const zipEntries = await decompressZIP(arrayBuffer);

    // Find and load shared strings
    const sharedStringsFile = zipEntries.find(entry => entry.name === 'xl/sharedStrings.xml');
    let sharedStrings = [];
    if (sharedStringsFile) {
      const sharedStringsXML = await sharedStringsFile.content.async("string");
      sharedStrings = parseSharedStrings(sharedStringsXML); // Parse shared strings into array
    }

    // Find and parse the sheet file (e.g., sheet1.xml)
    const sheetFile = zipEntries.find(entry => entry.name === 'xl/worksheets/sheet1.xml');
    if (sheetFile) {
      const xmlString = await sheetFile.content.async("string");
      const sheetData = parseXMLWithSAX(xmlString, sharedStrings); // Pass sharedStrings for content lookup
      console.log('Parsed Sheet Data:', sheetData);
    } else {
      console.error('No sheet XML file found in ZIP');
    }
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

module.exports = { fxlsx };
