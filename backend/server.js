import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import catalogRoutes from "./routes/catalogRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", healthRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/catalog", catalogRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});