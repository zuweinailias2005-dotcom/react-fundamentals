import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
  return Number(localStorage.getItem("page")) || 1;
});
  const [pageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
 const [search, setSearch] = useState(() => {
  return localStorage.getItem("search") || "";
});
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState(() => {
  return localStorage.getItem("sortBy") || "name";
});
  const [sortOrder, setSortOrder] = useState(() => {
  return localStorage.getItem("sortOrder") || "asc";
});
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  async function loadEmployees() {
  try {
    setLoading(true);

    const response = await api.get("/employees", {
      params: {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      },
    });

    setEmployees(response.data.data);
    setTotalRecords(response.data.count);
  } catch (error) {
    console.error(error);
    setError("Failed to fetch employees.");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional loading flag before fetch
  loadEmployees();
}, [currentPage, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
    setCurrentPage(1);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
  localStorage.setItem("page", currentPage);
  localStorage.setItem("search", search);
  localStorage.setItem("sortBy", sortBy);
  localStorage.setItem("sortOrder", sortOrder);
}, [currentPage, search, sortBy, sortOrder]);

  function handleSort(column) {
  if (sortBy === column) {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortBy(column);
    setSortOrder("asc");
  }

  setCurrentPage(1);
}

function renderSortIcon(column) {
  if (sortBy !== column) {
    return <ArrowUpDown size={16} className="text-gray-400" />;
  }

  return sortOrder === "asc" ? (
    <ArrowUp size={16} className="text-blue-600" />
  ) : (
    <ArrowDown size={16} className="text-blue-600" />
  );
}

function handleCheckboxChange(id) {
  if (selectedEmployees.includes(id)) {
    setSelectedEmployees(
      selectedEmployees.filter((employeeId) => employeeId !== id)
    );
  } else {
    setSelectedEmployees([...selectedEmployees, id]);
  }
}

function handleSelectAll() {
  if (selectedEmployees.length === employees.length) {
    setSelectedEmployees([]);
  } else {
    setSelectedEmployees(employees.map((employee) => employee.id));
  }
}

async function handleDelete() {
  const confirmDelete = window.confirm(
    `Delete ${selectedEmployees.length} employee(s)?`
  );

  if (!confirmDelete) return;

  try {
    await api.delete("/employees", {
      data: {
        ids: selectedEmployees,
      },
    });

    alert("Employees deleted successfully.");

    setSelectedEmployees([]);

    await loadEmployees();
  } catch (error) {
    console.error(error);
    alert("Failed to delete employees.");
  }
}


  if (loading) {
    return (
      <h2 className="text-center mt-10 text-xl font-semibold">
        Loading...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="text-center mt-10 text-red-500 text-xl font-semibold">
        {error}
      </h2>
    );
  }

  if (employees.length === 0) {
    return (
      <h2 className="text-center mt-10 text-xl font-semibold">
        No employees found.
      </h2>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Employees
      </h1>

      <div className="mb-6">
  <input
    type="text"
    placeholder="Search employees..."
    value={search}
    onChange={(e) => {
      setCurrentPage(1);
      setSearch(e.target.value);
    }}
    className="w-full md:w-80 border border-gray-300 rounded-lg p-2"
  />
</div>

<div className="mb-4 flex justify-end">
  <button
    onClick={handleDelete}
    disabled={selectedEmployees.length === 0}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
  >
    Delete Selected ({selectedEmployees.length})
  </button>
</div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white shadow-md">
         <thead className="bg-gray-200">
  <tr>

    <th className="border p-3 text-center">
  <input
    type="checkbox"
    checked={
      employees.length > 0 &&
      selectedEmployees.length === employees.length
    }
    onChange={handleSelectAll}
  />
</th>

    <th
      className="border p-3 cursor-pointer hover:bg-gray-100 transition"
      onClick={() => handleSort("name")}
    >
      <div className="flex items-center justify-between">
        <span>Name</span>
        {renderSortIcon("name")}
      </div>
    </th>

    <th
      className="border p-3 cursor-pointer hover:bg-gray-100 transition"
      onClick={() => handleSort("email")}
    >
      <div className="flex items-center justify-between">
        <span>Email</span>
        {renderSortIcon("email")}
      </div>
    </th>

    <th
      className="border p-3 cursor-pointer hover:bg-gray-100 transition"
      onClick={() => handleSort("department")}
    >
      <div className="flex items-center justify-between">
        <span>Department</span>
        {renderSortIcon("department")}
      </div>
    </th>

    <th
      className="border p-3 cursor-pointer hover:bg-gray-100 transition"
      onClick={() => handleSort("designation")}
    >
      <div className="flex items-center justify-between">
        <span>Designation</span>
        {renderSortIcon("designation")}
      </div>
    </th>

    <th
      className="border p-3 cursor-pointer hover:bg-gray-100 transition"
      onClick={() => handleSort("salary")}
    >
      <div className="flex items-center justify-between">
        <span>Salary</span>
        {renderSortIcon("salary")}
      </div>
    </th>

    <th
      className="border p-3 cursor-pointer hover:bg-gray-100 transition"
      onClick={() => handleSort("joining_date")}
    >
      <div className="flex items-center justify-between">
        <span>Joining Date</span>
        {renderSortIcon("joining_date")}
      </div>
    </th>

  </tr>
</thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>

  <td className="border p-3 text-center">
    <input
      type="checkbox"
      checked={selectedEmployees.includes(employee.id)}
      onChange={() => handleCheckboxChange(employee.id)}
    />
  </td>

  <td className="border p-3">{employee.name}</td>
  <td className="border p-3">{employee.email}</td>
  <td className="border p-3">{employee.department}</td>
  <td className="border p-3">{employee.designation}</td>
  <td className="border p-3">{employee.salary}</td>
  <td className="border p-3">{employee.joining_date}</td>

</tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-4 mt-6">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {Math.ceil(totalRecords / pageSize)}
  </span>

  <button
    onClick={() =>
      setCurrentPage((prev) =>
        prev < Math.ceil(totalRecords / pageSize)
          ? prev + 1
          : prev
      )
    }
    disabled={currentPage === Math.ceil(totalRecords / pageSize)}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
  >
    Next
  </button>
</div>
      </div>
    </div>
  );
}

export default Employees;