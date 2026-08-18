import { loadLookupCache } from "./lookupCache.js";
import { validateRow } from "./validator.js";

function normalizeValue(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function resolveFromCache(
  cache,
  fieldName,
  sourceValue,
  categoryId = null
) {
  if (!sourceValue) {
    return {
      status: "unmapped",
      sourceValue,
      code: "UNMAPPED_LOOKUP",
      reason: "Value is empty.",
    };
  }

  const normalizedValue = normalizeValue(sourceValue);

  // -----------------------------
  // Department
  // -----------------------------

  if (fieldName === "department") {
    return {
      status: "resolved",
      sourceValue,
      resolvedValue: String(sourceValue).trim(),
      method: "direct_value",
    };
  }

  // -----------------------------
  // Category
  // -----------------------------

  if (fieldName === "category") {
    const exact = cache.categories.get(normalizedValue);

    if (exact) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: exact.id,
        resolvedValue: exact.name,
        method: "exact_match",
      };
    }

    const alias = cache.aliases.get(
      `category:${normalizedValue}`
    );

    if (alias) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: alias.resolved_id,
        resolvedValue: alias.resolved_value,
        method: "alias",
      };
    }
  }

  // -----------------------------
  // Brand
  // -----------------------------

  if (fieldName === "brand") {
    const exact = cache.brands.get(normalizedValue);

    if (exact) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: exact.id,
        resolvedValue: exact.name,
        method: "exact_match",
      };
    }

    const alias = cache.aliases.get(
      `brand:${normalizedValue}`
    );

    if (alias) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: alias.resolved_id,
        resolvedValue: alias.resolved_value,
        method: "alias",
      };
    }
  }

  // -----------------------------
  // Fabric
  // -----------------------------

  if (fieldName === "fabric_type") {
    const exact = cache.fabrics.get(normalizedValue);

    if (exact) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: exact.id,
        resolvedValue: exact.name,
        method: "exact_match",
      };
    }

    const alias = cache.aliases.get(
      `fabric_type:${normalizedValue}`
    );

    if (alias) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: alias.resolved_id,
        resolvedValue: alias.resolved_value,
        method: "alias",
      };
    }
  }

  // -----------------------------
  // Style
  // -----------------------------

  if (fieldName === "style") {
    if (!categoryId) {
      return {
        status: "unmapped",
        sourceValue,
        code: "UNMAPPED_LOOKUP",
        reason:
          "Style cannot be resolved because the category has not been resolved.",
      };
    }

    // Exact style match must belong to the resolved category
    const exact = cache.styles.get(
      `${categoryId}:${normalizedValue}`
    );

    if (exact) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: exact.id,
        resolvedValue: exact.name,
        method: "exact_match",
      };
    }

    // Style alias
    const alias = cache.aliases.get(
      `style:${normalizedValue}`
    );

    if (alias) {
      return {
        status: "resolved",
        sourceValue,
        resolvedId: alias.resolved_id,
        resolvedValue: alias.resolved_value,
        method: "alias",
      };
    }
  }

  return {
    status: "unmapped",
    sourceValue,
    code: "UNMAPPED_LOOKUP",
    reason:
      "No exact lookup or alias match was found.",
  };
}

function addLookupError(
  errors,
  field,
  result,
  actionMessage
) {
  if (result.status === "unmapped") {
    errors.push({
      field,
      value: result.sourceValue || "",
      code: result.code || "UNMAPPED_LOOKUP",
      message: result.reason,
      action: actionMessage,
    });
  }
}

export async function buildReport(
  excelData,
  imageMap,
  tenantId
) {
  console.log("NEW REPORT BUILDER IS RUNNING");

  // Load all lookup information once
  const lookupCache = await loadLookupCache(tenantId);
  console.log("TOTAL EXCEL ROWS:", excelData.length);

  const report = {
    validationErrors: [],
    missingImageFolders: [],
    duplicateBarcodes: [],
    warnings: [],
  };

  const barcodeSet = new Set();

  for (const [index, row] of excelData.entries()) {

  // Show progress every 500 rows
  if (index % 500 === 0) {
    console.log(
      `Processing row ${index + 1} of ${excelData.length}`
    );
  }

  const excelRow = index + 4;

    // --------------------------------
    // BASIC VALIDATION
    // --------------------------------

    // IMPORTANT:
    // Do NOT pass supabase here.
    // Lookup validation is handled below.
    const errors = validateRow(row);

    // --------------------------------
    // CATEGORY
    // --------------------------------

    let categoryResult = null;

    if (
      row["Item"] &&
      String(row["Item"]).trim() !== ""
    ) {
      categoryResult = resolveFromCache(
        lookupCache,
        "category",
        row["Item"]
      );

      addLookupError(
        errors,
        "category",
        categoryResult,
        "Choose an existing lookup value or approve creation of a new value."
      );
    }

    // --------------------------------
    // STYLE
    // Ignore "-" and empty values
    // --------------------------------

    if (
      row["Style"] &&
      String(row["Style"]).trim() !== "-" &&
      String(row["Style"]).trim() !== ""
    ) {
      const categoryId =
        categoryResult?.resolvedId || null;

      const styleResult = resolveFromCache(
        lookupCache,
        "style",
        row["Style"],
        categoryId
      );

      addLookupError(
        errors,
        "style",
        styleResult,
        "Choose an existing lookup value or approve creation of a new value."
      );
    }

    // --------------------------------
    // BRAND
    // --------------------------------

    if (
      row["Brand Name"] &&
      String(row["Brand Name"]).trim() !== ""
    ) {
      const brandResult = resolveFromCache(
        lookupCache,
        "brand",
        row["Brand Name"]
      );

      addLookupError(
        errors,
        "brand",
        brandResult,
        "Choose an existing lookup value or approve creation of a new value."
      );
    }

    // --------------------------------
    // DEPARTMENT
    // --------------------------------

    if (
      row["Department"] &&
      String(row["Department"]).trim() !== ""
    ) {
      const departmentResult = resolveFromCache(
        lookupCache,
        "department",
        row["Department"]
      );

      addLookupError(
        errors,
        "department",
        departmentResult,
        "Choose an existing department value."
      );
    }

    // --------------------------------
    // STORE VALIDATION ERRORS
    // --------------------------------

    if (errors.length > 0) {
      report.validationErrors.push({
        row: excelRow,
        designNo: row["Design No."] || "",
        barcode: row.Barcode || "",
        errors,
      });
    }

    // --------------------------------
    // DUPLICATE BARCODE
    // --------------------------------

    if (row.Barcode) {
      const barcode = String(row.Barcode);

      if (barcodeSet.has(barcode)) {
        report.duplicateBarcodes.push({
          row: excelRow,
          barcode,
        });
      } else {
        barcodeSet.add(barcode);
      }
    }

    // --------------------------------
    // IMAGE CHECK
    // --------------------------------

    const designNo = row["Design No."];
    const color = row.Color;

    if (
      !imageMap[designNo] ||
      !imageMap[designNo][color]
    ) {
      report.missingImageFolders.push({
        row: excelRow,
        designNo,
        color,
        message: `Image folder missing for Design ${designNo}, Color ${color}`,
      });
    }
  }

  // --------------------------------
  // WARNINGS
  // --------------------------------

  report.warnings.push(
    "HEIC images are included as provided without conversion."
  );

  console.log("REPORT BUILDING COMPLETED");

  return report;
}