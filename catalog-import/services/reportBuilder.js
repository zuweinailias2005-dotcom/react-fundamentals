import { validateRow } from "./validator.js";

export function buildReport(excelData, imageMap) {
  console.log("NEW REPORT BUILDER IS RUNNING");

  const report = {
    validationErrors: [],
    missingImageFolders: [],
    duplicateBarcodes: [],
    warnings: [],
  };

  const barcodeSet = new Set();
  const variantSet = new Set();

  excelData.forEach((row, index) => {
    // Validate all required fields
    const errors = validateRow(row, variantSet);

    if (errors.length > 0) {
      report.validationErrors.push({
        row: index + 2, // Excel row number
        designNo: row["Design No."] || "",
        barcode: row.Barcode || "",
        errors,
      });
    }

    // Duplicate Barcode Check
    if (row.Barcode) {
      if (barcodeSet.has(row.Barcode)) {
        report.duplicateBarcodes.push({
          row: index + 2,
          barcode: row.Barcode,
        });
      } else {
        barcodeSet.add(row.Barcode);
      }
    }

    // Missing Image Folder Check
    const designNo = row["Design No."];
    const color = row.Color;

    if (
      !imageMap[designNo] ||
      !imageMap[designNo][color]
    ) {
      report.missingImageFolders.push({
        row: index + 2,
        designNo,
        color,
        message: `Image folder missing for Design ${designNo}, Color ${color}`
      });
    }
  });

  report.warnings.push(
    "HEIC images are included as provided without conversion."
  );

  console.log(report);

  return report;
}