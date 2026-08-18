import { processCatalogImport } from "../../catalog-import/index.js";

export async function processCatalogImportService(
  excelPath,
  zipPath,
  tenantId
) {
  return await processCatalogImport(
    excelPath,
    zipPath,
    tenantId
  );
}