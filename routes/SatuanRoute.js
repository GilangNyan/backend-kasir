import express from "express";
import {
  getSatuan,
  getSatuanById,
  createSatuan,
  updateSatuan,
  deleteSatuan,
  getFilteredSatuan,
} from "../controllers/Satuan.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/satuanall", verifyUser, getSatuan);
router.get("/satuan", verifyUser, getFilteredSatuan);
router.get("/satuan/:id", verifyUser, getSatuanById);
router.post("/satuan", verifyUser, createSatuan);
router.patch("/satuan/:id", verifyUser, updateSatuan);
router.delete("/satuan/:id", verifyUser, deleteSatuan);

export default router;
