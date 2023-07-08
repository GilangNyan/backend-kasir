import express from "express";
import { getInsight } from "../controllers/Dashboard.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/insight", verifyUser, getInsight);

export default router;
