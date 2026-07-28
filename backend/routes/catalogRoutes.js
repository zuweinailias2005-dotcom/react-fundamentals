import express from "express";
import multer from "multer";
import { importCatalog } from "../controllers/catalogController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/import",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "images", maxCount: 1 },
  ]),
  importCatalog
);

export default router;