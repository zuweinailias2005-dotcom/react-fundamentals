import XLSX from "xlsx";

export function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet);

  } catch (error) {
    console.error(error);
    throw error;
  }
}