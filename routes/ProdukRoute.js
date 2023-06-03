import express from "express";
import {
  getFilteredProduk,
  getProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,
} from "../controllers/Produk.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/produk", verifyUser, getFilteredProduk);
router.get("/produk/:barcode", verifyUser, getProdukById);
router.post("/produk", verifyUser, createProduk);
router.patch("/produk/:barcode", verifyUser, updateProduk);
router.delete("/produk/:barcode", verifyUser, deleteProduk);

export default router;
