import express from "express";
import { uploadEmployees } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/bulk-upload", uploadEmployees);

export default router;