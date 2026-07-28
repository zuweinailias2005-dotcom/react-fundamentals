import { processCatalogImportService } from "../services/catalogImportService.js";

export async function importCatalog(req, res) {
  try {
    const excelFile = req.files?.excel?.[0];
    const imageZip = req.files?.images?.[0];

    if (!excelFile || !imageZip) {
      return res.status(400).json({
        message: "Please upload both the Excel file and the Images ZIP.",
      });
    }

    const result = await processCatalogImportService(
      excelFile.path,
      imageZip.path
    );

    res.status(200).json({
      message: "Catalog imported successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}