import express from "express";
import {
  getLaporanHarian,
  getLaporanBulanan,
  getLaporanTahunan,
} from "../controllers/Laporan.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/lapharian", verifyUser, getLaporanHarian);
router.get("/lapbulanan", verifyUser, getLaporanBulanan);
router.get("/laptahunan", verifyUser, getLaporanTahunan);

export default router;
