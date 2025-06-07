// backend/validation/user.js
import { body, validationResult } from "express-validator";

// Funzione helper per inviare la prima risposta di errore trovata
const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Estrae il messaggio del primo errore per una risposta più semplice
		const firstError = errors.array({ onlyFirstError: true })[0].msg;
		return res.status(400).json({ success: false, message: firstError });
	}
	next();
};

const loginValidation = [
	body("email")
		.notEmpty()
		.withMessage("Email è obbligatoria per il login.")
		.isEmail()
		.withMessage("Formato email non valido per il login."),

	body("password")
		.notEmpty()
		.withMessage("Password è obbligatoria per il login."),

	handleValidationErrors,
];

// Array di validatori per la rotta di registrazione
const registerValidation = [
	// L'email non deve essere vuota e deve essere in formato valido
	body("email")
		.notEmpty()
		.withMessage("Email è obbligatoria.")
		.isEmail()
		.withMessage("Formato email non valido."),

	// La password non deve essere vuota e deve essere di almeno 6 caratteri
	body("password")
		.notEmpty()
		.withMessage("Password è obbligatoria.")
		.isLength({ min: 6 })
		.withMessage("La password deve essere di almeno 6 caratteri."),
	// Puoi anche usare isStrongPassword se preferisci
	// .isStrongPassword({ minLength: 6 }).withMessage("La password non è abbastanza robusta."),

	// Qualsiasi altro campo obbligatorio, es. 'name'
	body("name").notEmpty().withMessage("Name è obbligatorio."),

	// Middleware finale che gestisce gli errori raccolti
	handleValidationErrors,
];

export { loginValidation, registerValidation };
