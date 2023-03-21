import express from "express";
import {
  getCart,
  getCartById,
  getCartByBarcode,
  addItemsToCart,
  updateItemsQtyOnCart,
  updateItemsQtyWithDir,
  updateItemsDiskonOnCart,
  removeItemsFromCart,
} from "../controllers/Cart.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

// Route
router.get("/cart", verifyUser, getCart);
router.get("/cart/:id", verifyUser, getCartById);
router.get("/cartbarcode/:barcode", verifyUser, getCartByBarcode);
router.post("/cart", verifyUser, addItemsToCart);
router.patch("/cartqty/:id", verifyUser, updateItemsQtyOnCart);
router.patch("/cartqtydir/:id", verifyUser, updateItemsQtyWithDir);
router.patch("/cartdiskon/:id", verifyUser, updateItemsDiskonOnCart);
router.delete("/cart/:id", verifyUser, removeItemsFromCart);

export default router;
