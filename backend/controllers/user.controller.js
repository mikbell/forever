import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Assicurati che JWT_SECRET sia definito nel tuo file .env
// Assicurati che process.env.NODE_ENV sia impostato correttamente (es. 'development' o 'production')

// ---
// ## Funzioni Helper (Per coerenza e riusabilità)
// ---

/**
 * Crea un JSON Web Token (JWT) con l'ID dell'utente.
 * @param {string} id - L'ID dell'utente.
 * @returns {string} Il JWT generato.
 */
const createToken = (id) => {
	// expiresIn corrisponde a maxAge del cookie per coerenza.
	// L'ID è il payload del token, usato poi dal middleware di auth.
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Imposta un JWT come cookie HTTP-only per l'autenticazione sicura.
 * @param {object} res - L'oggetto della risposta Express.
 * @param {string} token - Il JWT da impostare.
 */
const setTokenCookie = (res, token) => {
	// Configurazione del cookie per la massima sicurezza.
	// Il nome 'token' invece di 'jwt' è spesso più comune, ma assicurati che il middleware
	// di autenticazione cerchi il nome corretto (es. 'jwt' o 'token'). Ho mantenuto 'jwt' per coerenza con il tuo codice.
	res.cookie("jwt", token, {
		httpOnly: true, // Impedisce l'accesso al cookie tramite JavaScript lato client (XSS protection)
		secure: process.env.NODE_ENV === "production", // Invia il cookie solo su HTTPS in produzione
		sameSite: "Lax", // Protezione CSRF: 'Strict' è molto restrittivo e può causare problemi con reindirizzamenti da altri siti (es. OAuth). 'Lax' è un buon compromesso.
		maxAge: 1 * 24 * 60 * 60 * 1000, // 1 giorno in millisecondi (deve corrispondere a expiresIn del JWT)
		// domain: ".yourdomain.com", // Solo se hai sottodomini e il cookie deve essere accessibile da tutti
		path: "/", // Il cookie è valido per tutto il dominio
	});
};

/**
 * Rimuove il cookie JWT dall'utente.
 * @param {object} res - L'oggetto della risposta Express.
 */
const clearTokenCookie = (res) => {
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax", // Usa lo stesso SameSite che hai usato per impostare il cookie
		path: "/",
	});
};

// ---
// ## Controller per l'Autenticazione Utente
// ---

/**
 * @desc Gestisce il login dell'utente.
 * @route POST /api/user/login
 * @access Public
 */
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// 1. Validazione input
		if (!email || !password) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Email e password sono obbligatorie.",
				});
		}
		if (!validator.isEmail(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Formato email non valido." });
		}

		// 2. Cerca l'utente
		const user = await User.findOne({ email });

		// 3. Verifica credenziali e stato utente (es. account non confermato, bloccato)
		// Utilizziamo un unico messaggio di errore generico per prevenire l'enumerazione degli account (sicurezza).
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res
				.status(401)
				.json({ success: false, message: "Credenziali non valide." });
		}

		// 4. Se l'utente è trovato e le credenziali sono corrette, genera e imposta il token
		const token = createToken(user._id);
		setTokenCookie(res, token);

		// 5. Rispondi con successo e dati utente
		res.status(200).json({
			success: true,
			message: "Login effettuato con successo.",
			token: token, // Ho incluso il token nel body per la convenienza del frontend (può essere rimosso se si usa solo httpOnly)
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin || false, // Assicurati che isAdmin sia sempre definito (default a false)
			},
		});
	} catch (error) {
		console.error("Errore durante il login utente:", error.message);
		res
			.status(500)
			.json({
				success: false,
				message: "Errore del server durante il login. Riprova più tardi.",
			});
	}
};

/**
 * @desc Gestisce la registrazione di un nuovo utente.
 * @route POST /api/user/register
 * @access Public
 */
export const register = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		// 1. Validazione input
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Nome, email e password sono obbligatori.",
				});
		}
		if (!validator.isEmail(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Formato email non valido." });
		}
		// Personalizza i requisiti di isStrongPassword o crea una tua validazione
		// Ad esempio: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }
		if (!validator.isStrongPassword(password, { minLength: 6 })) {
			// Ho abbassato a 6 caratteri per coerenza con il frontend
			return res.status(400).json({
				success: false,
				message: "La password deve essere di almeno 6 caratteri.",
			});
		}

		// 2. Verifica se l'utente esiste già
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(409)
				.json({
					success: false,
					message: "Utente con questa email già registrato.",
				});
		}

		// 3. Hash della password
		const saltRounds = 10; // Un buon valore per la complessità dell'hashing
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// 4. Creazione del nuovo utente
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			cartData: {}, // Inizializza il carrello per il nuovo utente
		});

		// 5. Genera e imposta il JWT token per il login automatico post-registrazione
		const token = createToken(newUser._id);
		setTokenCookie(res, token);

		// 6. Rispondi con successo e dati utente
		res.status(201).json({
			success: true,
			message: "Registrazione e login effettuati con successo.",
			token: token, // Ho incluso il token nel body per la convenienza del frontend (può essere rimosso se si usa solo httpOnly)
			user: {
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				isAdmin: newUser.isAdmin || false,
			},
		});
	} catch (error) {
		console.error("Errore durante la registrazione utente:", error.message);
		res
			.status(500)
			.json({
				success: false,
				message:
					"Errore del server durante la registrazione. Riprova più tardi.",
			});
	}
};

/**
 * @desc Gestisce il logout dell'utente.
 * @route POST /api/user/logout
 * @access Public (o Private se si richiede autenticazione per il logout)
 */
export const logout = async (req, res) => {
	try {
		clearTokenCookie(res); // Rimuove il cookie JWT
		res
			.status(200)
			.json({ success: true, message: "Logout effettuato con successo." });
	} catch (error) {
		console.error("Errore durante il logout:", error.message);
		res
			.status(500)
			.json({
				success: false,
				message: "Errore del server durante il logout.",
			});
	}
};

/**
 * @desc Gestisce il login di un utente amministratore.
 * @route POST /api/user/admin-login
 * @access Public
 */
export const adminLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		// 1. Validazione input (riusa la logica di login)
		if (!email || !password) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Email e password sono obbligatorie.",
				});
		}
		if (!validator.isEmail(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Formato email non valido." });
		}

		// 2. Cerca l'utente
		const user = await User.findOne({ email });

		// 3. Verifica credenziali e ruolo admin
		// Utilizziamo un unico messaggio di errore generico per prevenire l'enumerazione degli account.
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res
				.status(401)
				.json({ success: false, message: "Credenziali non valide." });
		}
		if (!user.isAdmin) {
			// Se le credenziali sono corrette ma non è admin, restituisci un errore specifico (o generico come sopra)
			// Dipende dalla politica di sicurezza: un errore generico è più sicuro.
			return res
				.status(403)
				.json({
					success: false,
					message: "Accesso negato. L'utente non è un amministratore.",
				});
		}

		// 4. Genera e imposta il token JWT per l'admin
		const token = createToken(user._id);
		setTokenCookie(res, token);

		// 5. Rispondi con successo e dati utente admin
		res.status(200).json({
			success: true,
			message: "Accesso amministratore effettuato con successo.",
			token: token, // Ho incluso il token nel body per la convenienza del frontend (può essere rimosso se si usa solo httpOnly)
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
			},
		});
	} catch (error) {
		console.error("Errore durante il login amministratore:", error.message);
		res
			.status(500)
			.json({
				success: false,
				message:
					"Errore del server durante il login amministratore. Riprova più tardi.",
			});
	}
};
