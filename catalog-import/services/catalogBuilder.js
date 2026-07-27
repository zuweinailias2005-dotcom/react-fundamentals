export function buildCatalog(excelData, imageMap) {
  const catalog = [];

  for (const row of excelData) {
    const designNo = row["Design No."];

    // Find existing product
    let product = catalog.find(
      (item) => item.designNo === designNo
    );

    // Create product if it doesn't exist
    if (!product) {
      product = {
        designNo,
        brand: row["Brand Name"],
        productName: row["Product Name"],
        colors: [],
      };

      catalog.push(product);
    }

   

    // Find existing color
    let colorGroup = product.colors.find(
      (color) => color.color === row.Color
    );

    // Create color if it doesn't exist
    if (!colorGroup) {
      colorGroup = {
        color: row.Color,
        images: imageMap[designNo]?.[row.Color] || [],
        variants: [],
      };

      product.colors.push(colorGroup);
    }

    colorGroup.variants.push({
  barcode: row.Barcode,
  size: row.Size,
  stock: Number(row.Qty),
  price: Number(row.MRP),
});
  }

  return catalog;
}