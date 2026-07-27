import fs from "fs";
import path from "path";

export function scanImages(extractedFolder) {
  const imageMap = {};

  const designFolders = fs.readdirSync(extractedFolder);

  for (const design of designFolders) {
    const designPath = path.join(extractedFolder, design);

    if (!fs.statSync(designPath).isDirectory()) continue;

    imageMap[design] = {};

    const colorFolders = fs.readdirSync(designPath);

    for (const color of colorFolders) {
      const colorPath = path.join(designPath, color);

      if (!fs.statSync(colorPath).isDirectory()) continue;

      const images = fs
        .readdirSync(colorPath)
        .filter((file) =>
          /\.(jpg|jpeg|png|heic)$/i.test(file)
        )
        .map((file) =>
          path.join(design, color, file)
        );

      imageMap[design][color] = images;
    }
  }

  return imageMap;
}