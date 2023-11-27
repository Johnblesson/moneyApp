import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from "morgan";
import path from 'path';
import { fileURLToPath } from "url";
import { register } from "./src/controllers/auth.js";
import authRoutes from "./src/routes/auth.js";
import appRoutes from "./src/routes/appRoutes.js";
import dbConnect from './src/database/connection.js';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
dbConnect();
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
import { upload } from "./src/upload/upload.js";

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", appRoutes);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));