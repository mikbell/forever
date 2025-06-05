import express from "express";
import {
	getCart,
	addToCart,
	updateCart,
} from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/get", auth, getCart);
router.post("/add", auth, addToCart);
router.post("/update", auth, updateCart);

export default router;