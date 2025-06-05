import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * @desc Get all products
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ success: true, products });
	} catch (error) {
		console.error("Error fetching products:", error);
		res
			.status(500)
			.json({ success: false, message: "Server error fetching products." });
	}
};

/**
 * @desc Get a single product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProduct = async (req, res) => {
	try {
		// Find a product by its ID
		const product = await Product.findById(req.params.id); // Await the Mongoose query

		// If no product is found, return a 404 Not Found error
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found." });
		}

		// Respond with success and the found product
		res.status(200).json({ success: true, product });
	} catch (error) {
		// Log the detailed error for debugging purposes
		console.error("Error fetching product:", error);
		// L'errore ObjectId.kind è ora gestito dal middleware di validazione
		res
			.status(500)
			.json({ success: false, message: "Server error fetching product." });
	}
};

/**
 * @desc Create a new product
 * @route POST /api/products/create
 * @access Private (e.g., Admin)
 */
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, category, type, sizes, bestseller } =
			req.body;

		// Validazione di base
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

		if (isNaN(price) || parseFloat(price) <= 0) {
			return res
				.status(400)
				.json({ success: false, message: "Price must be a positive number." });
		}

		const isBestseller =
			typeof bestseller === "string"
				? bestseller.toLowerCase() === "true"
				: Boolean(bestseller);

		// --- FIX PER SIZES: Parsifica la stringa JSON in un array ---
		let parsedSizes = [];
		if (typeof sizes === "string") {
			try {
				const tempSizes = JSON.parse(sizes);
				if (Array.isArray(tempSizes)) {
					parsedSizes = tempSizes;
				} else {
					parsedSizes = [sizes];
				}
			} catch (e) {
				parsedSizes = [sizes];
			}
		} else if (Array.isArray(sizes)) {
			parsedSizes = sizes;
		} else {
			parsedSizes = [sizes];
		}
		parsedSizes = parsedSizes.map((s) => String(s));
		// --- FINE FIX PER SIZES ---

		// --- FIX PER IMMAGINI: Gestione Cloudinary Upload e Pulizia ---
		const uploadedImageUrls = [];
		const imageFields = ["image1", "image2", "image3", "image4"]; // Nomi dei campi attesi da Multer

		// Debugging: Controlla cosa Multer ha allegato a req.files
		console.log("req.files received by controller:", req.files);

		if (!req.files || Object.keys(req.files).length === 0) {
			console.error(
				"No files found in req.files. Multer might not be processing uploads."
			);
			return res.status(400).json({
				success: false,
				message: "No image files uploaded or processed by server.",
			});
		}

		for (const fieldName of imageFields) {
			if (req.files[fieldName] && req.files[fieldName][0]) {
				const file = req.files[fieldName][0];

				// Check if buffer is available (for memoryStorage)
				if (!file.buffer) {
					console.error(`Error: file.buffer is missing for ${fieldName}.`);
					continue;
				}

				// Convert buffer to a Base64 Data URI
				const b64 = Buffer.from(file.buffer).toString("base64");
				const dataUri = "data:" + file.mimetype + ";base64," + b64;

				try {
					// Upload the Data URI to Cloudinary
					const result = await cloudinary.uploader.upload(dataUri, {
						folder: "e-commerce-products",
					});
					uploadedImageUrls.push(result.secure_url);
					console.log(
						`Successfully uploaded ${fieldName} to Cloudinary: ${result.secure_url}`
					);
				} catch (uploadError) {
					console.error(
						`Error uploading image ${fieldName} to Cloudinary:`,
						uploadError
					);
				}
			}
		}

		if (uploadedImageUrls.length === 0) {
			console.error("No images were successfully uploaded to Cloudinary.");
			return res.status(400).json({
				success: false,
				message: "At least one product image must be successfully uploaded.",
			});
		}
		// --- FINE FIX PER IMMAGINI ---

		// Crea il prodotto nel database
		const newProduct = await Product.create({
			name,
			description,
			price: parseFloat(price),
			category,
			type,
			sizes: parsedSizes,
			bestseller: isBestseller,
			images: uploadedImageUrls,
		});

		res.status(201).json({
			success: true,
			message: "Product created successfully",
			product: newProduct,
		});
	} catch (error) {
		console.error("Server error creating product:", error);
		res.status(500).json({
			success: false,
			message: "Server error creating product",
			error: error.message,
		});
	}
};

/**
 * @desc Update an existing product by ID
 * @route PUT /api/products/:id
 * @access Private (e.g., Admin)
 */
export const updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		// I dati sono già stati validati e formattati dal middleware
		const updateData = req.body;

		// Se l'aggiornamento include nuove immagini, la logica di upload andrebbe qui,
		// simile a `createProduct`.
		// Assicurati che `productImagesUpload` sia applicato anche a questa rotta se necessario.

		// Find and update the product. `new: true` returns the updated document.
		// `runValidators: true` ensures schema validators run on update operations.
		const product = await Product.findByIdAndUpdate(productId, updateData, {
			new: true,
			runValidators: true, // Important for Mongoose schema validation on updates
		});

		// If no product is found, return a 404 Not Found error
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found." });
		}

		// Respond with success and the updated product
		res.status(200).json({
			success: true,
			message: "Product updated successfully",
			product,
		});
	} catch (error) {
		console.error("Error updating product:", error);
		// Gli errori ObjectId.kind e ValidationError sono ora gestiti dal middleware di validazione
		res.status(500).json({
			success: false,
			message: "Server error updating product",
			error: error.message,
		});
	}
};

/**
 * @desc Delete a product by ID
 * @route DELETE /api/products/:id
 * @access Private (e.g., Admin)
 */
export const deleteProduct = async (req, res) => {
	try {
		const productId = req.params.id;

		// Find and delete the product
		const product = await Product.findByIdAndDelete(productId);

		// If no product is found, return a 404 Not Found error
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found." });
		}

		// Delete images from Cloudinary if they exist
		if (product.images && product.images.length > 0) {
			for (const imageUrl of product.images) {
				const publicId = imageUrl.split("/").pop().split(".")[0];
				try {
					await cloudinary.uploader.destroy(`e-commerce-products/${publicId}`);
					console.log(`Deleted image ${publicId} from Cloudinary.`);
				} catch (cloudinaryError) {
					console.error(
						`Failed to delete image ${publicId} from Cloudinary:`,
						cloudinaryError
					);
					// Continua l'esecuzione anche se una singola immagine non viene eliminata da Cloudinary
				}
			}
		}

		// Respond with success message
		res
			.status(200)
			.json({ success: true, message: "Product deleted successfully." });
	} catch (error) {
		console.error("Error deleting product:", error);
		// L'errore ObjectId.kind è ora gestito dal middleware di validazione
		res.status(500).json({
			success: false,
			message: "Server error deleting product",
			error: error.message,
		});
	}
};
