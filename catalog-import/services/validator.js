export function validateRow(row, variantSet) {
  const errors = [];

  // Design No.
  if (!row["Design No."]) {
    errors.push("Design Number is required.");
  }

  // Product Name
  if (!row["Product Name"]) {
    errors.push("Product Name is required.");
  }

  // Brand
  if (!row["Brand Name"]) {
    errors.push("Brand Name is required.");
  }

  // Color
  if (!row.Color) {
    errors.push("Color is required.");
  }

  // Size
  if (!row.Size) {
    errors.push("Size is required.");
  }

  // Barcode
  if (!row.Barcode) {
    errors.push("Barcode is required.");
  }

  // Quantity
  if (
    row.Qty === undefined ||
    row.Qty === "" ||
    isNaN(Number(row.Qty))
  ) {
    errors.push("Quantity must be a valid number.");
  }

  // Price
  if (
    row.MRP === undefined ||
    row.MRP === "" ||
    isNaN(Number(row.MRP))
  ) {
    errors.push("Price must be a valid number.");
  }

  // Duplicate Variant
  const variantKey = `${row["Design No."]}_${row.Color}_${row.Size}`;

  if (variantSet.has(variantKey)) {
    errors.push("Duplicate variant found.");
  } else {
    variantSet.add(variantKey);
  }

  return errors;
}