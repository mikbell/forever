import { validationResult } from "express-validator";

// Middleware per gestire i risultati della validazione di express-validator
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next(); // Nessun errore, passa al prossimo middleware/controller
	}

	// Se ci sono errori, formatta e invia una risposta 400
	const extractedErrors = [];
	errors
		.array()
		.map((err) => extractedErrors.push({ [err.param || err.path]: err.msg }));

	return res.status(400).json({
		success: false,
		message: "Errore di validazione dei dati.",
		errors: extractedErrors,
	});
};

export default validate;
