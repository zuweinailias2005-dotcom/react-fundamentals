import AdmZip from "adm-zip";
import fs from "fs-extra";
import path from "path";

export function extractZip(){

    try{
        const zipPath = path.join(
            process.cwd(),
            "input",
            "sample_catalog_images.zip"
        );

        const extractPath = path.join(
            
            process.cwd(),
            "temp",
            "extracted-images"
        );

        fs.ensureDirSync(extractPath);

        const zip = new AdmZip(zipPath);

        zip.extractAllTo(extractPath,true);

        return extractPath;
    } catch(error){
        console.error(error);
        throw error;
    }
}