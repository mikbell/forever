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
			.json({ success: false, message: "Errore nel recupero dei prodotti." });
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
				.json({ success: false, message: "Prodotto non trovato." });
		}

		// Respond with success and the found product
		res.status(200).json({ success: true, product });
	} catch (error) {
		// Log the detailed error for debugging purposes
		console.error("Error fetching product:", error);
		// L'errore ObjectId.kind è ora gestito dal middleware di validazione
		res
			.status(500)
			.json({ success: false, message: "Errore nel recupero del prodotto." });
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
				.json({ success: false, message: "Dati mancanti o non validi." });
		}

		if (isNaN(price) || parseFloat(price) <= 0) {
			return res
				.status(400)
				.json({ success: false, message: "Prezzo non valido." });
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

		if (!req.files || Object.keys(req.files).length === 0) {
			console.error(
				"Errore: Nessun file immagine caricato o processato dal server."
			);
			return res.status(400).json({
				success: false,
				message: "Nessun file immagine caricato o processato dal server.",
			});
		}

		for (const fieldName of imageFields) {
			if (req.files[fieldName] && req.files[fieldName][0]) {
				const file = req.files[fieldName][0];

				// Check if buffer is available (for memoryStorage)
				if (!file.buffer) {
					console.error(`Nessun buffer trovato per ${fieldName}.`);
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
						`Immagine ${fieldName} caricata con URL: ${result.secure_url}`
					);
				} catch (uploadError) {
					console.error(
						`Errore nell'upload dell'immagine ${fieldName} su Cloudinary:`,
						uploadError
					);
				}
			}
		}

		if (uploadedImageUrls.length === 0) {
			console.error("Nessuna immagine caricata con successo.");
			return res.status(400).json({
				success: false,
				message: "Almeno una immagine deve essere caricata.",
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
			message: "Prodotto creato con successo.",
			product: newProduct,
		});
	} catch (error) {
		console.error("Errore nella creazione del prodotto:", error);
		res.status(500).json({
			success: false,
			message: "Errore nella creazione del prodotto.",
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

		const product = await Product.findByIdAndUpdate(productId, updateData, {
			new: true,
			runValidators: true, // Important for Mongoose schema validation on updates
		});

		// If no product is found, return a 404 Not Found error
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Prodotto non trovato." });
		}

		// Respond with success and the updated product
		res.status(200).json({
			success: true,
			message: "Prodotto aggiornato con successo.",
			product,
		});
	} catch (error) {
		console.error("Errore nell'aggiornamento del prodotto:", error);
		// Gli errori ObjectId.kind e ValidationError sono ora gestiti dal middleware di validazione
		res.status(500).json({
			success: false,
			message: "Errore nell'aggiornamento del prodotto.",
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
				.json({ success: false, message: "Prodotto non trovato." });
		}

		// Delete images from Cloudinary if they exist
		if (product.images && product.images.length > 0) {
			for (const imageUrl of product.images) {
				const publicId = imageUrl.split("/").pop().split(".")[0];
				try {
					await cloudinary.uploader.destroy(`e-commerce-products/${publicId}`);
					console.log(`Immagine ${publicId} eliminata da Cloudinary.`);
				} catch (cloudinaryError) {
					console.error(
						`Errore nell'eliminazione dell'immagine ${publicId} da Cloudinary:`,
						cloudinaryError
					);
				}
			}
		}

		// Respond with success message
		res
			.status(200)
			.json({ success: true, message: "Prodotto eliminato con successo." });
	} catch (error) {
		console.error("Errore nell'eliminazione del prodotto:", error);
		// L'errore ObjectId.kind è ora gestito dal middleware di validazione
		res.status(500).json({
			success: false,
			message: "Errore nell'eliminazione del prodotto.",
			error: error.message,
		});
	}
};
