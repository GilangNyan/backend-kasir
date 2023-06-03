import express from "express";
import {
  getSupplier,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getFilteredSupplier,
} from "../controllers/Supplier.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/supplierall", verifyUser, getSupplier);
router.get("/supplier", verifyUser, getFilteredSupplier);
router.get("/supplier/:id", verifyUser, getSupplierById);
router.post("/supplier", verifyUser, createSupplier);
router.patch("/supplier/:id", verifyUser, updateSupplier);
router.delete("/supplier/:id", verifyUser, deleteSupplier);

export default router;
