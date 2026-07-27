export function buildReport(excelData, imageMap) {
  const report = {
    missingRequiredFields: [],
    missingImageFolders: [],
    duplicateBarcodes: [],
    unmatchedImages: [],
    warnings: [],
  };

  const barcodeSet = new Set();

  for (const row of excelData) {
   
    if (
      !row["Design No."] ||
      !row.Color ||
      !row.Barcode
    ) {
      report.missingRequiredFields.push({
        designNo: row["Design No."],
        barcode: row.Barcode,
      });
    }

    // Duplicate Barcode
    if (barcodeSet.has(row.Barcode)) {
      report.duplicateBarcodes.push(row.Barcode);
    } else {
      barcodeSet.add(row.Barcode);
    }

    
    if (
      !imageMap[row["Design No."]] ||
      !imageMap[row["Design No."]][row.Color]
    ) {
      report.missingImageFolders.push({
        designNo: row["Design No."],
        color: row.Color,
      });
    }
  }

  report.warnings.push(
    "HEIC images are included as provided without conversion."
  );

  return report;
}