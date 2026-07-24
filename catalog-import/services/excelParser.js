import path from "path";
import XLSX from "xlsx";

export function parseExcel() {
  try {
    const filePath = path.join(
      process.cwd(),
      "input",
      "sample_catalog_import_updated.xlsx"
    );

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
}
}