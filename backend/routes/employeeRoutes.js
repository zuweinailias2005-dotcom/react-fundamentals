import express from "express";
import {
    fetchEmployees,
    removeEmployees,
    uploadEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/bulk-upload", uploadEmployees);
router.get("/", fetchEmployees);
router.delete("/", removeEmployees);

export default router;