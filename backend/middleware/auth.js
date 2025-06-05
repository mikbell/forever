import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Importa il modello User per cercare l'utente

/**
 * Middleware di autenticazione per proteggere le rotte.
 * Verifica la presenza e la validità di un JWT token passato tramite cookie HTTP-only.
 * Se il token è valido, aggiunge l'oggetto utente (o solo l'ID) alla richiesta (req.user)
 * e passa al prossimo middleware/controller.
 * In caso contrario, risponde con un errore di autorizzazione.
 *
 * @param {object} req - Oggetto della richiesta Express.
 * @param {object} res - Oggetto della risposta Express.
 * @param {function} next - Funzione per passare al prossimo middleware.
 */
const auth = async (req, res, next) => {
	// 1. Recupera il token dal cookie 'jwt'
	const token = req.cookies.jwt;

	// 2. Verifica la presenza del token
	if (!token) {
		// Status 401 Unauthorized indica che l'autenticazione è richiesta ma non fornita o invalida.
		return res
			.status(401)
			.json({ success: false, message: "Non autorizzato. Token non fornito." });
	}

	try {
		// 3. Verifica il token JWT
		// jwt.verify è sincrono se non usi un callback. Se lo usi, diventa asincrono.
		// È meglio usarlo in un blocco try-catch per gestire gli errori di verifica.
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		// Optional: 4. Trova l'utente nel database e allega l'oggetto utente alla richiesta
		// Questo ti permette di accedere a `req.user` nei tuoi controller successivi.
		// `select('-password')` esclude la password per sicurezza.
		// `_id` è l'ID dell'utente nel payload del token.
		const user = await User.findById(decodedToken.id).select("-password");

		if (!user) {
			// L'utente non esiste più nel DB (ad es. eliminato), ma il token è valido.
			return res
				.status(401)
				.json({
					success: false,
					message: "Non autorizzato. Utente non trovato.",
				});
		}

		// Allega l'utente autenticato alla richiesta
		req.user = user;
		req.userId = user._id; // Comodo per accedere all'ID utente

		// 5. Passa al prossimo middleware/controller
		next();
	} catch (err) {
		// Gestione degli errori di verifica del token (es. token scaduto, non valido)
		console.error("Errore di autenticazione JWT:", err.message);

		// 403 Forbidden indica che il server ha capito la richiesta ma si rifiuta di autorizzarla.
		// In questo caso, il token è stato fornito ma è invalido.
		if (err.name === "TokenExpiredError") {
			return res
				.status(403)
				.json({
					success: false,
					message: "Token scaduto. Effettua nuovamente il login.",
				});
		}
		if (err.name === "JsonWebTokenError") {
			return res
				.status(403)
				.json({
					success: false,
					message: "Token non valido. Non autorizzato.",
				});
		}
		// Per tutti gli altri errori
		return res
			.status(500)
			.json({
				success: false,
				message: "Errore server durante l'autenticazione.",
			});
	}
};

export default auth;
