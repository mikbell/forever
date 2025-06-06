import { body, check, param } from "express-validator";

// Regole di validazione per la creazione di un prodotto
export const createProductValidation = [
	body("name")
		.notEmpty()
		.withMessage("Il nome del prodotto è obbligatorio.")
		.isLength({ min: 3, max: 100 })
		.withMessage("Il nome deve avere tra 3 e 100 caratteri."),
	body("description")
		.notEmpty()
		.withMessage("La descrizione è obbligatoria.")
		.isLength({ min: 10, max: 1000 })
		.withMessage("La descrizione deve avere tra 10 e 1000 caratteri."),
	body("price")
		.notEmpty()
		.withMessage("Il prezzo è obbligatorio.")
		.isFloat({ gt: 0 })
		.withMessage("Il prezzo deve essere un numero positivo."),
	body("category")
		.notEmpty()
		.withMessage("La categoria è obbligatoria.")
		.isIn(["Men", "Women", "Unisex", "Kids", "Other"])
		.withMessage("Categoria non valida."),
	body("type")
		.notEmpty()
		.withMessage("Il tipo è obbligatorio.")
		.isIn([
			"Topwear",
			"Bottomwear",
			"Winterwear",
			"Footwear",
			"Accessories",
			"Jewellery",
			"Other",
		])
		.withMessage("Tipo non valido."),
	body("sizes")
		.notEmpty()
		.withMessage("Seleziona almeno una taglia.") // Assicurati che non sia vuoto
		.custom((value, { req }) => {
			// Usa un custom validator per parsare e validare
			let parsedSizes;
			try {
				// Tenta di parsare il valore se è una stringa (come quando arriva da FormData)
				parsedSizes = typeof value === "string" ? JSON.parse(value) : value;
			} catch (e) {
				// Se il parsing fallisce, è un formato JSON non valido
				throw new Error("Le taglie devono essere un array JSON valido.");
			}

			// Dopo il parsing, verifica che sia un array
			if (!Array.isArray(parsedSizes)) {
				throw new Error("Le taglie devono essere un array.");
			}
			// Verifica che l'array non sia vuoto
			if (parsedSizes.length === 0) {
				throw new Error("Seleziona almeno una taglia.");
			}

			const validSizes = ["XS", "S", "M", "L", "XL", "XXL"];
			// Verifica che tutti gli elementi dell'array siano stringhe valide
			if (
				!parsedSizes.every(
					(s) => typeof s === "string" && validSizes.includes(s)
				)
			) {
				throw new Error(
					"Le taglie devono essere un array di stringhe valide (XS, S, M, L, XL, XXL)."
				);
			}

			// IMPORTANTE: Sostituisci il valore originale in req.body con l'array parsato
			// in modo che il controller riceva un array JavaScript.
			req.body.sizes = parsedSizes;
			return true;
		}),
	body("bestseller")
		.optional()
		.isBoolean()
		.withMessage("Bestseller deve essere un valore booleano (true/false).")
		.toBoolean(),

	check().custom((value, { req }) => {
		const hasAnyImage = ["image1", "image2", "image3", "image4"].some(
			(field) => req.files && req.files[field] && req.files[field].length > 0
		);

		if (!hasAnyImage) {
			throw new Error("È richiesta almeno un'immagine del prodotto.");
		}
		return true;
	}),
];

// Regole di validazione per l'aggiornamento di un prodotto
export const updateProductValidation = [
	param("id").isMongoId().withMessage("ID prodotto non valido."),
	body("name")
		.optional()
		.notEmpty()
		.withMessage("Il nome del prodotto non può essere vuoto.")
		.isLength({ min: 3, max: 100 })
		.withMessage("Il nome deve avere tra 3 e 100 caratteri."),
	body("description")
		.optional()
		.notEmpty()
		.withMessage("La descrizione non può essere vuota.")
		.isLength({ min: 10, max: 1000 })
		.withMessage("La descrizione deve avere tra 10 e 1000 caratteri."),
	body("price")
		.optional()
		.isFloat({ gt: 0 })
		.withMessage("Il prezzo deve essere un numero positivo."),
	body("category")
		.optional()
		.notEmpty()
		.withMessage("La categoria non può essere vuota.")
		.isIn(["Men", "Women", "Unisex", "Kids", "Other"])
		.withMessage("Categoria non valida."),
	body("type")
		.optional()
		.notEmpty()
		.withMessage("Il tipo non può essere vuoto.")
		.isIn([
			"Topwear",
			"Bottomwear",
			"Winterwear",
			"Footwear",
			"Accessories",
			"Jewellery",
			"Other",
		])
		.withMessage("Tipo non valido."),
	body("sizes")
		.optional() // Rendi opzionale per l'update, ma se presente, valida
		.custom((value, { req }) => {
			let parsedSizes;
			try {
				parsedSizes = typeof value === "string" ? JSON.parse(value) : value;
			} catch (e) {
				throw new Error("Le taglie devono essere un array JSON valido.");
			}

			if (!Array.isArray(parsedSizes)) {
				throw new Error("Le taglie devono essere un array.");
			}
			if (parsedSizes.length === 0) {
				throw new Error("Seleziona almeno una taglia.");
			}

			const validSizes = ["XS", "S", "M", "L", "XL", "XXL"];
			if (
				!parsedSizes.every(
					(s) => typeof s === "string" && validSizes.includes(s)
				)
			) {
				throw new Error(
					"Le taglie devono essere un array di stringhe valide (XS, S, M, L, XL, XXL)."
				);
			}
			req.body.sizes = parsedSizes; // Sostituisci con l'array parsato
			return true;
		}),
	body("bestseller")
		.optional()
		.isBoolean()
		.withMessage("Bestseller deve essere un valore booleano (true/false).")
		.toBoolean(),
];

// Regole di validazione per l'ID del prodotto (usato per getProduct e deleteProduct)
export const productIdValidation = [
	param("id").isMongoId().withMessage("ID prodotto non valido."),
];
