import { useState } from "react";
import { importCatalog } from "../services/catalogApi";

function CatalogImport() {
  const [excelFile, setExcelFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  async function handleImport() {
    if (!excelFile || !imageZip) {
      setMessage("Please select both the Excel file and the Images ZIP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await importCatalog(excelFile, imageZip);

      console.log("Backend Response:", result);

      setMessage(result.message || "Catalog imported successfully.");
      setValidationErrors(
  result.data?.report?.validationErrors || []
);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while importing the catalog."
      );
      setValidationErrors([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Catalog Import
        </h1>

        {/* Excel Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Upload Excel File
          </label>

          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setExcelFile(e.target.files[0])}
            className="w-full border rounded p-2"
          />

          {excelFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {excelFile.name}
            </p>
          )}
        </div>

        {/* ZIP Upload */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">
            Upload Images ZIP
          </label>

          <input
            type="file"
            accept=".zip"
            onChange={(e) => setImageZip(e.target.files[0])}
            className="w-full border rounded p-2"
          />

          {imageZip && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {imageZip.name}
            </p>
          )}
        </div>

        {/* Import Button */}
        <button
          type="button"
          onClick={handleImport}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Importing..." : "Import Catalog"}
        </button>

        {/* Status Message */}
        {message && (
          <div className="mt-6 p-3 rounded bg-gray-100 text-center">
            {message}
          </div>
        )}

        {validationErrors.length > 0 && (
  <div className="mt-6 bg-red-50 border border-red-300 rounded-lg p-4">
    <h2 className="font-bold text-red-700 mb-3">
      Validation Errors
    </h2>

    {validationErrors.map((error, index) => (
      <div key={index} className="mb-4">
        <p className="font-semibold">
          Row {error.row}
        </p>

        <ul className="list-disc ml-6 text-red-600">
          {error.errors.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}

export default CatalogImport;