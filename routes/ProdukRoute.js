import express from "express";
import {
  getFilteredProduk,
  getProduk,
  getProdukById,
} from "../controllers/Produk.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/produk", verifyUser, getFilteredProduk);
router.get("/produk/:barcode", verifyUser, getProdukById);

export default router;
