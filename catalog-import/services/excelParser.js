import XLSX from "xlsx";

export function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      range: 2,
      defval: "",
    });

    console.log("FIRST PARSED ROW:");
    console.log(rows[0]);

    console.log("PARSED COLUMN NAMES:");
    console.log(Object.keys(rows[0] || {}));

    return rows;
  } catch (error) {
    console.error("Excel parsing failed:", error);
    throw error;
  }
}