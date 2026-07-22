import { useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";

function UploadEmployees() {
  const [employees, setEmployees] = useState([]);

  function handleFileUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      const workbook = XLSX.read(data, {
        type: "binary",
      });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
  raw: false,
});

      console.log(jsonData);

      setEmployees(jsonData);
    };

    reader.readAsBinaryString(file);
  }

  function handleInputChange(index, field, value) {
  const updatedEmployees = [...employees];

  updatedEmployees[index][field] = value;

  setEmployees(updatedEmployees);
}

function handleDeleteRow(index) {
  const updatedEmployees = employees.filter((_, i) => i !== index);
  setEmployees(updatedEmployees);
}

async function handleSave() {
    if (!window.confirm("Are you sure you want to save these employees?")) {
  return;
}
    try {
      const response = await api.post(
        "/employees/bulk-upload",
        employees
      );

      alert(response.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Upload failed."
      );
    }
  }

  

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">
        Upload Employees
      </h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
      />

      <p className="mt-4">
  Total Employees: {employees.length}
</p>

{employees.length > 0 && (
  <table className="mt-6 w-full border border-gray-300">
    <thead className="bg-gray-200">
      <tr>
        <th className="border p-2">Name</th>
        <th className="border p-2">Email</th>
        <th className="border p-2">Department</th>
        <th className="border p-2">Designation</th>
        <th className="border p-2">Salary</th>
        <th className="border p-2">Joining Date</th>
        <th className="border p-2">Action</th>
      </tr>
    </thead>

    <tbody>
  {employees.map((employee, index) => (
    <tr key={index}>
      <td className="border p-2">
        <input
          type="text"
          value={employee.name}
          onChange={(e) =>
            handleInputChange(index, "name", e.target.value)
          }
          className="w-full border rounded p-1"
        />
      </td>

      <td className="border p-2">
        <input
          type="email"
          value={employee.email}
          onChange={(e) =>
            handleInputChange(index, "email", e.target.value)
          }
          className="w-full border rounded p-1"
        />
      </td>

      <td className="border p-2">
        <input
          type="text"
          value={employee.department}
          onChange={(e) =>
            handleInputChange(index, "department", e.target.value)
          }
          className="w-full border rounded p-1"
        />
      </td>

      <td className="border p-2">
        <input
          type="text"
          value={employee.designation}
          onChange={(e) =>
            handleInputChange(index, "designation", e.target.value)
          }
          className="w-full border rounded p-1"
        />
      </td>

      <td className="border p-2">
        <input
          type="number"
          value={employee.salary}
          onChange={(e) =>
            handleInputChange(index, "salary", e.target.value)
          }
          className="w-full border rounded p-1"
        />
      </td>

      <td className="border p-2">
        <input
          type="date"
          value={
            employee["joining-date"]
              ? XLSX.SSF.format(
                  "yyyy-mm-dd",
                  employee["joining-date"]
                )
              : ""
          }
          onChange={(e) =>
            handleInputChange(
              index,
              "joining-date",
              e.target.value
            )
          }
          className="w-full border rounded p-1"
        />
      </td>

      <td className="border p-2 text-center">
  <button
    onClick={() => handleDeleteRow(index)}
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  >
    Delete
  </button>
</td>

    </tr>
  ))}
</tbody>
  </table>
)}

<button
  onClick={handleSave}
  className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
>
  Save Employees
</button>
    </div>
  );
}

export default UploadEmployees;