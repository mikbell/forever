import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Funzione utility per creare un token JWT
const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Funzione utility per impostare il cookie del token
const setTokenCookie = (res, token) => {
	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax",
		maxAge: 1 * 24 * 60 * 60 * 1000, // 1 giorno
		path: "/",
	});
};

// Funzione utility per cancellare il cookie del token
const clearTokenCookie = (res) => {
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax",
		path: "/",
	});
};

// Funzione utility per inviare risposte di errore standardizzate
const sendErrorResponse = (res, statusCode, message) => {
	return res.status(statusCode).json({ success: false, message });
};

// Controller per il login utente
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {

		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			// Qui gestiamo solo l'errore specifico di credenziali errate
			return sendErrorResponse(res, 401, "Credenziali non valide.");
		}

		const token = createToken(user._id);
		setTokenCookie(res, token);

		res.status(200).json({
			success: true,
			message: "Login effettuato con successo.",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin || false,
			},
		});
	} catch (error) {
		console.error("Errore durante il login utente:", error.message);
		sendErrorResponse(
			res,
			500,
			"Errore del server durante il login. Riprova più tardi."
		);
	}
};

// Controller per la registrazione utente
export const register = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		// Le validazioni sono ora gestite dai middleware prima di questo controller.

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return sendErrorResponse(
				res,
				409,
				"Utente con questa email già registrato."
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			cartData: {}, // Assumi che cartData sia un campo da inizializzare
		});

		const token = createToken(newUser._id);
		setTokenCookie(res, token);

		res.status(201).json({
			success: true,
			message: "Registrazione e login effettuati con successo.",
			user: {
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				isAdmin: newUser.isAdmin || false,
			},
		});
	} catch (error) {
		console.error("Errore durante la registrazione utente:", error.message);
		sendErrorResponse(
			res,
			500,
			"Errore del server durante la registrazione. Riprova più tardi."
		);
	}
};

// Controller per il logout utente
export const logout = async (req, res) => {
	try {
		clearTokenCookie(res);
		res
			.status(200)
			.json({ success: true, message: "Logout effettuato con successo." });
	} catch (error) {
		console.error("Errore durante il logout:", error.message);
		sendErrorResponse(res, 500, "Errore del server durante il logout.");
	}
};

// Controller per il login amministratore
export const adminLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return sendErrorResponse(res, 401, "Credenziali non valide.");
		}
		if (!user.isAdmin) {
			return sendErrorResponse(
				res,
				403,
				"Accesso negato. L'utente non è un amministratore."
			);
		}

		const token = createToken(user._id);
		setTokenCookie(res, token);

		res.status(200).json({
			success: true,
			message: "Accesso amministratore effettuato con successo.",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
			},
		});
	} catch (error) {
		console.error("Errore durante il login amministratore:", error.message);
		sendErrorResponse(
			res,
			500,
			"Errore del server durante il login amministratore. Riprova più tardi."
		);
	}
};
