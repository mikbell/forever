import express from "express";
import {
	createProduct,
	getProducts,
	getProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post(
	"/create",
	adminAuth,
	upload.fields([
		{ name: "image1", maxCount: 1 },
		{ name: "image2", maxCount: 1 },
		{ name: "image3", maxCount: 1 },
		{ name: "image4", maxCount: 1 },
	]),
	createProduct 
);

// Other product routes (example)
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/update/:id", adminAuth, updateProduct);
router.delete("/delete/:id", adminAuth, deleteProduct);

export default router;
