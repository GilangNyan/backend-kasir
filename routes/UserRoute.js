import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getFilteredUser,
} from "../controllers/Users.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/user", verifyUser, getFilteredUser);
router.get("/user/:id", verifyUser, getUserById);
router.post("/user", verifyUser, createUser);
router.patch("/user/:id", verifyUser, updateUser);
router.delete("/user/:id", verifyUser, deleteUser);

export default router;
