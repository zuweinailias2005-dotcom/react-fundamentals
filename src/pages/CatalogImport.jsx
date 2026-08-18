import { useState } from "react";
import { importCatalog } from "../services/catalogApi";
import { resolveLookup } from "../services/importResolutionApi";

function CatalogImport() {
  const [excelFile, setExcelFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [validationErrors, setValidationErrors] = useState([]);

  // Stores the import job ID returned by backend
  const [jobId, setJobId] = useState(null);

  // ---------------------------------------
  // IMPORT CATALOG
  // ---------------------------------------

  async function handleImport() {
    if (!excelFile || !imageZip) {
      setMessage("Please select both the Excel file and the Images ZIP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setValidationErrors([]);
      setJobId(null);

      const result = await importCatalog(
        excelFile,
        imageZip
      );

      console.log("Backend Response:", result);

      // Save job ID
      setJobId(result.data?.jobId || null);

      // Show backend message
      setMessage(
        result.message ||
          "Catalog imported successfully."
      );

      // Get validation errors from report
      setValidationErrors(
        result.data?.report?.validationErrors || []
      );
    } catch (error) {
      console.error("Import error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while importing the catalog."
      );

      setValidationErrors([]);
      setJobId(null);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------
  // RESOLVE LOOKUP
  // ---------------------------------------

  async function handleResolveLookup(error, action) {
    if (!jobId) {
      setMessage(
        "Import job ID is missing. Please import the catalog again."
      );
      return;
    }

    try {
      const targetValue = window.prompt(
        action === "create_new"
          ? `Enter new ${error.field}:`
          : `Enter existing ${error.field} ID:`
      );

      // User cancelled the prompt
      if (!targetValue) {
        return;
      }

      const result = await resolveLookup(jobId, {
        tenant_id:
          "11111111-1111-1111-1111-111111111111",

        field_name: error.field,

        source_value: error.value,

        action,

        target_id_or_value: targetValue,

        created_by: null,
      });

      console.log(
        "Lookup resolved:",
        result
      );

      // Show success message
      setMessage(
        `${error.field} "${error.value}" resolved successfully.`
      );

      // Remove resolved error from the screen
      setValidationErrors((previousErrors) =>
        previousErrors
          .map((rowError) => ({
            ...rowError,

            errors: rowError.errors.filter(
              (item) =>
                !(
                  item.field === error.field &&
                  item.value === error.value
                )
            ),
          }))
          .filter(
            (rowError) =>
              rowError.errors.length > 0
          )
      );
    } catch (error) {
      console.error(
        "Lookup resolution error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to resolve lookup."
      );
    }
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold text-center mb-8">
          Catalog Import
        </h1>

        {/* -------------------------------- */}
        {/* EXCEL UPLOAD */}
        {/* -------------------------------- */}

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Upload Excel File
          </label>

          <input
            type="file"
            accept=".xlsx"
            onChange={(e) =>
              setExcelFile(
                e.target.files?.[0] || null
              )
            }
            className="w-full border rounded p-2"
          />

          {excelFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {excelFile.name}
            </p>
          )}
        </div>

        {/* -------------------------------- */}
        {/* ZIP UPLOAD */}
        {/* -------------------------------- */}

        <div className="mb-8">
          <label className="block font-semibold mb-2">
            Upload Images ZIP
          </label>

          <input
            type="file"
            accept=".zip"
            onChange={(e) =>
              setImageZip(
                e.target.files?.[0] || null
              )
            }
            className="w-full border rounded p-2"
          />

          {imageZip && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {imageZip.name}
            </p>
          )}
        </div>

        {/* -------------------------------- */}
        {/* IMPORT BUTTON */}
        {/* -------------------------------- */}

        <button
          type="button"
          onClick={handleImport}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading
            ? "Importing..."
            : "Import Catalog"}
        </button>

        {/* -------------------------------- */}
        {/* STATUS MESSAGE */}
        {/* -------------------------------- */}

        {message && (
          <div className="mt-6 p-3 rounded bg-gray-100 text-center">
            {message}
          </div>
        )}

        {/* -------------------------------- */}
        {/* JOB ID */}
        {/* -------------------------------- */}

        {jobId && (
          <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700">
              Import Job ID:
            </p>

            <p className="text-xs text-blue-600 break-all">
              {jobId}
            </p>
          </div>
        )}

        {/* -------------------------------- */}
        {/* VALIDATION ERRORS */}
        {/* -------------------------------- */}

        {validationErrors.length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-300 rounded-lg p-4">

            <h2 className="font-bold text-red-700 mb-4">
              Validation Errors
            </h2>

            {validationErrors.map(
              (rowError, rowIndex) => (
                <div
                  key={rowIndex}
                  className="mb-5 bg-white border border-red-200 rounded-lg p-4"
                >

                  {/* ROW */}
                  <p className="font-semibold mb-3">
                    Row {rowError.row}
                  </p>

                  {/* DESIGN NUMBER */}
                  {rowError.designNo && (
                    <p className="text-sm text-gray-600">
                      Design No.:{" "}
                      {rowError.designNo}
                    </p>
                  )}

                  {/* BARCODE */}
                  {rowError.barcode && (
                    <p className="text-sm text-gray-600 mb-3">
                      Barcode:{" "}
                      {rowError.barcode}
                    </p>
                  )}

                  {/* ERRORS */}
                  {rowError.errors.map(
                    (item, errorIndex) => (
                      <div
                        key={errorIndex}
                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded"
                      >

                        {/* FIELD + VALUE */}
                        <p className="font-semibold text-red-700">
                          {item.field}:{" "}
                          {item.value}
                        </p>

                        {/* MESSAGE */}
                        <p className="text-sm text-gray-600 mt-1 mb-3">
                          {item.message}
                        </p>

                        {/* ACTION BUTTONS */}
                        {item.code ===
                          "UNMAPPED_LOOKUP" && (
                          <div className="flex gap-3 flex-wrap">

                            {/* MAP EXISTING */}
                            <button
                              type="button"
                              onClick={() =>
                                handleResolveLookup(
                                  item,
                                  "map_existing"
                                )
                              }
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Map Existing
                            </button>

                            {/* CREATE NEW */}
                            <button
                              type="button"
                              onClick={() =>
                                handleResolveLookup(
                                  item,
                                  "create_new"
                                )
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Create New
                            </button>

                          </div>
                        )}

                      </div>
                    )
                  )}

                </div>
              )
            )}

          </div>
        )}

        {/* -------------------------------- */}
        {/* NO ERRORS */}
        {/* -------------------------------- */}

        {!loading &&
          jobId &&
          validationErrors.length === 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg text-center">
              <p className="font-semibold text-green-700">
                No validation errors found! 🎉
              </p>
            </div>
          )}

      </div>
    </div>
  );
}

export default CatalogImport;