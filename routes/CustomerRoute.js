import express from "express";
import {
  getCustomer,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getFilteredCustomer,
} from "../controllers/Customer.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/customerall", verifyUser, getCustomer);
router.get("/customer", verifyUser, getFilteredCustomer);
router.get("/customer/:id", verifyUser, getCustomerById);
router.post("/customer", verifyUser, createCustomer);
router.patch("/customer/:id", verifyUser, updateCustomer);
router.delete("/customer/:id", verifyUser, deleteCustomer);

export default router;
