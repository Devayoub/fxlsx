const { decompressZIP } = require('../src/zipHandler');
const JSZip = require("jszip");

// Mock the JSZip class and its static method loadAsync
jest.mock("jszip", () => {
  const mockJSZipInstance = {
    forEach: jest.fn((callback) => {
      // Simulate the structure of a ZIP file with multiple files
      callback("xl/worksheets/sheet1.xml", { async: () => "mock XML content" });
      callback("xl/sharedStrings.xml", { async: () => "mock Shared Strings content" });
    })
  };

  return {
    loadAsync: jest.fn().mockResolvedValue(mockJSZipInstance) // Mock static method `loadAsync`
  };
});

describe('ZIP Handler', () => {
  test('should extract files from ZIP and log contents', async () => {
    const arrayBuffer = new ArrayBuffer(4);
    const result = await decompressZIP(arrayBuffer);

    expect(result).toEqual([
      { name: "xl/worksheets/sheet1.xml", content: expect.any(Object) },
      { name: "xl/sharedStrings.xml", content: expect.any(Object) }
    ]);
  });
});
