import Product from "../models/product.model.js";
import cloudinary from "cloudinary";

export const getProducts = (req, res) => {};

export const getProduct = (req, res) => {};

export const createProduct = async (req, res) => {
	// Added 'async' because we'll use await
	try {
		const { name, description, price, category, type, sizes, bestseller } =
			req.body;

		// Basic validation for required fields
		if (
			!name ||
			!description ||
			!price ||
			!category ||
			!type ||
			!sizes ||
			bestseller === undefined
		) {
			return res
				.status(400)
				.json({ success: false, message: "Missing required product fields." });
		}

		// More specific validation
		if (isNaN(price) || parseFloat(price) <= 0) {
			return res
				.status(400)
				.json({ success: false, message: "Price must be a positive number." });
		}

		const isBestseller =
			typeof bestseller === "string"
				? bestseller.toLowerCase() === "true"
				: Boolean(bestseller);

		// Handle image files
		const uploadedImageUrls = [];
		const imageFields = ["image1", "image2", "image3", "image4"];

		for (const fieldName of imageFields) {
			if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
				const file = req.files[fieldName][0];
				uploadedImageUrls.push(
					`/uploads/${file.filename || file.originalname}`
				);
			}
		}

		// Create the product in the database
		const newProduct = await Product.create({
			name,
			description,
			price: parseFloat(price),
			category,
			type,
			sizes: Array.isArray(sizes) ? sizes : [sizes],
			bestseller: isBestseller,
			images: uploadedImageUrls,
		});

		// Respond with success and the created product's ID
		res.status(201).json({
			success: true,
			message: "Product created successfully",
			product: newProduct,
		});
	} catch (error) {
		console.error("Error creating product:", error);
		res
			.status(500)
			.json({
				success: false,
				message: "Server error creating product",
				error: error.message,
			});
	}
};

export const updateProduct = (req, res) => {};

export const deleteProduct = (req, res) => {};
