import { bulkUploadEmployees } from "../services/employeeServices.js";

export async function uploadEmployees(req, res) {
  try {
    const employees = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        message: "No employee data received.",
      });
    }

    for (const employee of employees) {
      if (!employee.name || !employee.email) {
        return res.status(400).json({
          message: "Name and Email are required for every employee.",
        });
      }

      if (employee.salary && isNaN(employee.salary)) {
        return res.status(400).json({
          message: "Salary must be a valid number.",
        });
      }

      if (
        employee.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)
      ) {
        return res.status(400).json({
          message: `Invalid email: ${employee.email}`,
        });
      }
    }

    const data = await bulkUploadEmployees(employees);

    res.status(201).json({
      message: "Employees uploaded successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}