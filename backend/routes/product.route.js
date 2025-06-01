import express from "express";
import * as productController from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:id", productController.getProduct);
productRouter.post(
	"/create",
	upload.fields([
		{ name: "image1", maxCount: 1 },
		{ name: "image2", maxCount: 1 },
		{ name: "image3", maxCount: 1 },
		{ name: "image4", maxCount: 1 },
	]),
	productController.createProduct
);
productRouter.put("/update/:id", productController.updateProduct);
productRouter.delete("/delete/:id", productController.deleteProduct);

export default productRouter;
