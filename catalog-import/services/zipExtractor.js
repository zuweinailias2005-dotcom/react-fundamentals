import AdmZip from "adm-zip";
import fs from "fs-extra";
import path from "path";

export function extractZip(zipPath) {
  try {

    const extractPath = path.join(
      process.cwd(),
      "temp",
      "extracted-images"
    );

    // Clean old extracted files
    fs.removeSync(extractPath);

    fs.ensureDirSync(extractPath);

    const zip = new AdmZip(zipPath);

    zip.extractAllTo(extractPath, true);

    return extractPath;

  } catch (error) {
    console.error(error);
    throw error;
  }
}