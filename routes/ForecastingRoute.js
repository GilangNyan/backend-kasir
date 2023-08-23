import express from "express";
import {
  getForecast,
  simpanForecast,
  getRekapForecast,
  getTopForecast,
} from "../controllers/Forecasting.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get("/forecast", verifyUser, getForecast);
router.post("/simpanForecast", verifyUser, simpanForecast);
router.get("/rekapForecast", verifyUser, getRekapForecast);
router.get("/topForecast", verifyUser, getTopForecast);

export default router;
