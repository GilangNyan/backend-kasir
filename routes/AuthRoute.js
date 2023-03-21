import express from "express";
import { logIn, logOut, me } from "../controllers/Auth.js";

const router = express.Router();

router.get("/me", me);
router.post("/login", logIn);
router.delete("/logout", logOut);

export default router;
