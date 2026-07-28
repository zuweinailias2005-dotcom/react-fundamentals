
import { processCatalogImport } from "../../catalog-import/index.js";

export async function processCatalogImportService(excelPath, zipPath) {
  return await processCatalogImport(excelPath, zipPath);
}