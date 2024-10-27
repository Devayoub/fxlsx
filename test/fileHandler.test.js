const { readFileAsArrayBuffer } = require('../src/fileHandler');
const fs = require('fs').promises;

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(() => Buffer.from([1, 2, 3, 4])),
  }
}));

describe('File Handler', () => {
  test('should read file and return ArrayBuffer', async () => {
    const buffer = await readFileAsArrayBuffer('dummy-path');
    expect(buffer).toBeInstanceOf(ArrayBuffer);
    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([1, 2, 3, 4]));
  });
});
