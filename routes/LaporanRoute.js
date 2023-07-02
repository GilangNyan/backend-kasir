import express from "express";
import {
  getLaporanHarian,
  getLaporanBulanan,
  getLaporanTahunan,
  getLaporanPerProduk,
} from "../controllers/Laporan.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/lapharian", verifyUser, getLaporanHarian);
router.get("/lapbulanan", verifyUser, getLaporanBulanan);
router.get("/laptahunan", verifyUser, getLaporanTahunan);
router.get("/lapproduk", verifyUser, getLaporanPerProduk);

export default router;
