import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan"; // --> 1. Aggiunto per il logging delle richieste
import rateLimit from "express-rate-limit"; // --> 2. Aggiunto per la sicurezza (rate limiting)
import hpp from "hpp"; // --> 3. Aggiunto per la sicurezza (parameter pollution)
import { verifyOrder } from "./controllers/order.controller.js";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

// --- Configurazione App ---
const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);

// --- Connessioni a Servizi Esterni ---
connectDB();
connectCloudinary();

app.post(
	"/api/order/verify",
	express.raw({ type: "application/json" }),
	verifyOrder
);

// --- Middleware di Sicurezza e Logging ---
app.use(helmet()); // Imposta vari header HTTP per la sicurezza
app.use(express.json({ limit: "10kb" })); // Limita la dimensione del payload JSON
app.use(cookieParser());
app.use(hpp()); // Protegge contro l'inquinamento dei parametri HTTP

// Rate Limiting per prevenire attacchi brute-force
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minuti
	max: 100, // Limita ogni IP a 100 richieste per finestra
	standardHeaders: true,
	legacyHeaders: false,
	message: "Troppe richieste da questo IP, riprova tra 15 minuti.",
});
app.use("/api", limiter); // Applica il rate limiter a tutte le rotte API

// Logging delle richieste in modalità sviluppo
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Configurazione CORS
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];
app.use(
	cors({
		origin: (origin, callback) => {
			// Permetti richieste senza origin (es. Postman) o se l'origin è nella whitelist
			if (!origin || allowedOrigins.includes(origin)) {
				// --> Usato .includes per leggibilità
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// --- Rotte API ---
app.get("/", (req, res) => res.send("API is running!"));
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// --- Gestione Errori ---
// 404 Handler (se nessuna rotta corrisponde)
app.use((req, res, next) => {
	const error = new Error(
		`Impossibile trovare ${req.originalUrl} su questo server.`
	);
	error.statusCode = 404;
	next(error); // Passa l'errore al gestore di errori globale
});

// Error Handler Globale (cattura tutti gli errori passati da 'next(error)')
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	// Invia una risposta di errore pulita al client
	res.status(err.statusCode).json({
		success: false,
		message: err.message,
		// Opzionale: mostra lo stack trace solo in sviluppo
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
});

// --- Avvio Server ---
// Il server si avvia solo se la connessione al DB ha successo
const startServer = async () => {
	try {
		await connectDB(); // Si assicura che la connessione sia stabilita
		app.listen(port, () =>
			console.log(`Server listening on http://localhost:${port}`)
		);
	} catch (error) {
		console.error(
			"Impossibile connettersi al database. L'applicazione non si avvierà.",
			error
		);
		process.exit(1); // Esce dal processo se non può connettersi al DB
	}
};

startServer();
