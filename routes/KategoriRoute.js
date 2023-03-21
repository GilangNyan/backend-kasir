import express from "express";
import {
  getKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
  getFilteredKategori,
} from "../controllers/Kategori.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
// router.get("/kategori", verifyUser, getKategori);
router.get("/kategori/:id", verifyUser, getKategoriById);
router.post("/kategori", verifyUser, createKategori);
router.patch("/kategori/:id", verifyUser, updateKategori);
router.delete("/kategori/:id", verifyUser, deleteKategori);
router.get("/kategori", verifyUser, getFilteredKategori);

export default router;
