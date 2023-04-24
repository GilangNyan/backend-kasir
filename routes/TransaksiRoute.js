import express from "express";
import {
  getTransaksi,
  getTransaksiById,
  createTransaksi,
} from "../controllers/Transaksi.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get("/transaksi", verifyUser, getTransaksi);
router.get("/transaksi/:id", verifyUser, getTransaksiById);
router.post("/transaksi", verifyUser, createTransaksi);

export default router;
