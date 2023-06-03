import express from "express";
import {
  getStok,
  getStokById,
  createStok,
  deleteStok,
  getFilteredStok,
} from "../controllers/Stok.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get("/stokall", verifyUser, getStok);
router.get("/stok", verifyUser, getFilteredStok);
router.get("/stok/:id", verifyUser, getStokById);
router.post("/stok", verifyUser, createStok);
router.delete("/stok/:id", verifyUser, deleteStok);

export default router;
