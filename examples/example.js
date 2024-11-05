const { excelify } = require('../src/index');

 
async function testExcelify() {
    try {
        const data = await excelify('./file.xlsx'); // Adjust path if necessary
        console.log(data); // Log the data read from the Excel file
    } catch (error) {
        console.error('Error reading Excel file:', error);
    }
}

testExcelify();