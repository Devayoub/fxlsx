const sax = require('sax');

function parseXMLWithSAX(xmlString, sharedStrings) {
  const parser = sax.parser(true);
  const sheetData = [];
  let currentRow = null;
  let currentCell = null;
  let inSheetData = false; // Flag to indicate if we're in <sheetData>

  parser.onopentag = function (node) {
    if (node.name === 'sheetData') {
      inSheetData = true; // Entering <sheetData> section
    }

    if (inSheetData) {
      if (node.name === 'row') {
        currentRow = []; // Initialize a new row
      } else if (node.name === 'c') {
        // Check if cell is a shared string (`s` type in .xlsx)
        const cellType = node.attributes.t;
        currentCell = {
          isShared: cellType === 's',
          value: ''
        };
      }
    }
  };

  parser.ontext = function (text) {
    if (currentCell) {
      currentCell.value += text;
    }
  };

  parser.onclosetag = function (tagName) {
    if (tagName === 'c' && currentCell) {
      // If cell uses shared strings, replace index with actual text
      const cellValue = currentCell.isShared
        ? sharedStrings[parseInt(currentCell.value, 10)] || ""
        : currentCell.value;
      currentRow && currentRow.push(cellValue); // Add cell to row if row is initialized
      currentCell = null; // Reset current cell
    } else if (tagName === 'row' && currentRow) {
      // End of row; add it to sheet data if row is initialized
      sheetData.push(currentRow);
      currentRow = null;
    } else if (tagName === 'sheetData') {
      inSheetData = false; // Exiting <sheetData> section
    }
  };

  parser.onerror = function (error) {
    console.error("Error parsing XML:", error.message);
    parser.resume(); // Continue parsing despite errors
  };

  parser.write(xmlString).close();
  return sheetData;
}

module.exports = { parseXMLWithSAX };
