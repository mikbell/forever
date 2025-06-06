import express from "express";
import {
	placeOrder,
	placeOrderStripe,
	verifyOrder,
	allOrders,
	userOrders,
	updateStatus,
} from "../controllers/order.controller.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/all", auth, adminAuth, allOrders);
router.put("/update", auth, adminAuth, updateStatus);

router.post("/place", auth, placeOrder);
router.post("/stripe", auth, placeOrderStripe);
router.get("/user-orders", auth, userOrders);
router.post("/verify", verifyOrder);

export default router;
