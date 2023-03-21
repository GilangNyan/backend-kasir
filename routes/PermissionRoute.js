import express from "express";
import {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/Permission.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/permission", verifyUser, getPermissions);
router.get("/permission/:id", verifyUser, getPermissionById);
router.post("/permission", verifyUser, createPermission);
router.patch("/permission/:id", verifyUser, updatePermission);
router.delete("/permission/:id", verifyUser, deletePermission);

export default router;
