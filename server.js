import express from "express";
import { PORT } from "./src/config/env.js";
import { DB } from "./src/database/db.js";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import ingredientsRouter from "./src/routes/ingredients.routes.js";
import productRouter from "./src/routes/products.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import "./src/jobs/lowStock.job.js";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger YAML safely
const swaggerPath = path.join(__dirname, "src", "config", "swagger.yaml");

import fs from "fs";
if (!fs.existsSync(swaggerPath)) {
  console.error(`Swagger file not found at ${swaggerPath}`);
  process.exit(1); // stop server if Swagger file is missing
}

const swaggerDocument = YAML.load(swaggerPath);

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger UI
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/api", (req, res) => res.redirect("/api/docs"));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ingredients", ingredientsRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

// 404 fallback
app.use((req, res, next) =>
  res.status(404).json({ message: "Route not found" })
);

// Error middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  try {
    await DB();
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
});
