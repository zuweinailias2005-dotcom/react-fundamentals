import fs from "fs";
import path from "path";
import { buildCatalog } from "./services/catalogBuilder.js";
import { parseExcel } from "./services/excelParser.js";
import { scanImages } from "./services/imageScanner.js";
import { buildReport } from "./services/reportBuilder.js";
import { extractZip } from "./services/zipExtractor.js";

try {
  const excelData = parseExcel();
  console.log("Excel Rows:", excelData.length);

  const extractedFolder = extractZip();
  console.log("ZIP Extracted Successfully!");

  const imageMap = scanImages(extractedFolder);

  const catalog = buildCatalog(excelData, imageMap);

  const report = buildReport(excelData, imageMap);

  const outputPath = path.join(
  process.cwd(),
  "output",
  "catalog.json"
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(catalog, null, 2)
);

console.log("catalog.json created successfully!");

const reportPath = path.join(
  process.cwd(),
  "output",
  "import_report.json"
);

fs.writeFileSync(
  reportPath,
  JSON.stringify(report, null, 2)
);

console.log("import_report.json created successfully!");

  console.log(JSON.stringify(catalog, null, 2));
} catch (error) {
  console.error(error);
}