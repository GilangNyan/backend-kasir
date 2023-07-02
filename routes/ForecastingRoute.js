import express from "express";
import { getForecast } from "../controllers/Forecasting.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get("/forecast", verifyUser, getForecast);

export default router;
