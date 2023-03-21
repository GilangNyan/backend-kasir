import express from "express";
import {
  getRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/Role.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/role", verifyUser, getRole);
router.get("/role/:id", verifyUser, getRoleById);
router.post("/role", verifyUser, createRole);
router.patch("/role/:id", verifyUser, updateRole);
router.delete("/role/:id", verifyUser, deleteRole);

export default router;
