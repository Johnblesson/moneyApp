import express from "express";
const router = express.Router();

import { transaction } from "../controllers/sendMoney.js";

// Routes
router.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to the API!"});
});

router.post("/sendMoney", transaction)

export default router;