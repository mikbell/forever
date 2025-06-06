import express from "express";
import {
	getCart,
	addToCart,
	updateCart,
	removeFromCart,
	clearCart,
} from "../controllers/cart.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/get", auth, getCart);
router.post("/add", auth, addToCart);
router.post("/update", auth, updateCart);
router.post("/remove", auth, removeFromCart);
router.post("/clear", auth, clearCart);

export default router;
