import express from "express";
import {
    resolveLookupController,
} from "../controllers/importResolutionController.js";

const router = express.Router();

router.post(
  "/:jobId/resolve-lookup",
  resolveLookupController
);

export default router;