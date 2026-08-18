export function validateRow(row) {
  const errors = [];

  // -----------------------------
  // Design No.
  // -----------------------------

  if (
    !row["Design No."] ||
    !String(row["Design No."]).trim()
  ) {
    errors.push("Design Number is required.");
  }

  // -----------------------------
  // Product Name
  // -----------------------------

  if (
    !row["Product Name"] ||
    !String(row["Product Name"]).trim()
  ) {
    errors.push("Product Name is required.");
  }

  // -----------------------------
  // Brand
  // -----------------------------

  if (
    !row["Brand Name"] ||
    !String(row["Brand Name"]).trim()
  ) {
    errors.push("Brand Name is required.");
  }

  // -----------------------------
  // Color
  // -----------------------------

  if (
    !row.Color ||
    !String(row.Color).trim()
  ) {
    errors.push("Color is required.");
  }

  // -----------------------------
  // Size
  // -----------------------------

  if (
    !row.Size ||
    !String(row.Size).trim()
  ) {
    errors.push("Size is required.");
  }

  // -----------------------------
  // Barcode
  // -----------------------------

  if (
    !row.Barcode ||
    !String(row.Barcode).trim()
  ) {
    errors.push("Barcode is required.");
  }

  // -----------------------------
  // Quantity
  // -----------------------------

  if (
    row.Qty === undefined ||
    row.Qty === null ||
    row.Qty === "" ||
    isNaN(Number(row.Qty))
  ) {
    errors.push("Quantity must be a valid number.");
  }

  // -----------------------------
  // Price
  // -----------------------------

  if (
    row.MRP === undefined ||
    row.MRP === null ||
    row.MRP === "" ||
    isNaN(Number(row.MRP))
  ) {
    errors.push("Price must be a valid number.");
  }

  return errors;
}