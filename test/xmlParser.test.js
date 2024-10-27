const { parseXMLWithSAX } = require('../src/xmlParser');

describe('XML Parser with SAX', () => {
  test('should parse XML with shared strings and produce structured data', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const sharedStrings = ["Hello", "World"];
    const xmlString = `
      <worksheet>
        <sheetData>
          <row>
            <c t="s"><v>0</v></c>
            <c><v>42</v></c>
          </row>
          <row>
            <c t="s"><v>1</v></c>
            <c><v>100</v></c>
          </row>
        </sheetData>
      </worksheet>
    `;

    const result = parseXMLWithSAX(xmlString, sharedStrings);

    expect(result).toEqual([
      ["Hello", "42"],
      ["World", "100"]
    ]);

    consoleSpy.mockRestore();
  });
});
