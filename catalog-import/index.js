import crypto from "crypto";
import fs from "fs";
import path from "path";
import { buildCatalog } from "./services/catalogBuilder.js";
import { parseExcel } from "./services/excelParser.js";
import { scanImages } from "./services/imageScanner.js";
import { buildReport } from "./services/reportBuilder.js";
import { extractZip } from "./services/zipExtractor.js";

export async function processCatalogImport(excelPath, zipPath, tenantId) {
 const jobId = crypto.randomUUID();
  const excelData = parseExcel(excelPath);

  const extractedFolder = extractZip(zipPath);

  const imageMap = scanImages(extractedFolder);

  const catalog = buildCatalog(excelData, imageMap);

  const report = await buildReport(
    excelData,
    imageMap,
    tenantId
  );

  
  const outputFolder = path.join(
  process.cwd(),
  "..",
  "catalog-import",
  "output"
);


fs.mkdirSync(outputFolder, { recursive: true });

  
 fs.writeFileSync(
    path.join(outputFolder, "catalog.json"),
    JSON.stringify(catalog, null, 2)
  );

  
  fs.writeFileSync(
    path.join(outputFolder, "import_report.json"),
    JSON.stringify(report, null, 2)
  ); 

  
  return {
    catalog,
    report,
  };
}