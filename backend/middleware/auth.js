// In backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Funzione helper per inviare risposte di errore standardizzate
const sendErrorResponse = (res, statusCode, message) => {
	return res.status(statusCode).json({ success: false, message });
};

// Middleware di autenticazione generale
const auth = async (req, res, next) => {
	let token;

	// 1. Cerca il token nell'header Authorization (Bearer Token)
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	// 2. Se non trovato nell'header, cerca nel cookie 'jwt'
	if (!token && req.cookies && req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		// Nessun token trovato
		return sendErrorResponse(res, 401, "Non autorizzato. Token non fornito.");
	}

	try {
		// Verifica il token
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		// Trova l'utente basandosi sull'ID nel token, escludendo la password
		const user = await User.findById(decodedToken.id).select("-password");

		if (!user) {
			// Utente non trovato nel database
			return sendErrorResponse(
				res,
				401,
				"Non autorizzato. Utente non trovato."
			);
		}

		// Allega l'utente e l'ID alla richiesta per i middleware e i controller successivi
		req.user = user;
		req.userId = user._id;

		// Prosegui al prossimo middleware/controller
		next();
	} catch (err) {
		// Gestione specifica degli errori JWT
		if (err.name === "TokenExpiredError") {
			return sendErrorResponse(
				res,
				403,
				"Token scaduto. Effettua nuovamente il login."
			);
		}
		if (err.name === "JsonWebTokenError") {
			return sendErrorResponse(res, 403, "Token non valido. Non autorizzato.");
		}
		// Per altri errori generici, invia una risposta 500
		console.error("Errore JWT durante l'autenticazione:", err.message);
		return sendErrorResponse(
			res,
			500,
			"Errore server durante l'autenticazione."
		);
	}
};

// Middleware per l'autenticazione degli amministratori
const adminAuth = (req, res, next) => {
	// Questo middleware dovrebbe essere usato DOPO il middleware 'auth'
	// in modo che req.user sia già popolato.
	if (!req.user || !req.user.isAdmin) {
		return sendErrorResponse(
			res,
			403,
			"Accesso negato. Richiede privilegi di amministratore."
		);
	}
	next();
};

export { auth, adminAuth };
