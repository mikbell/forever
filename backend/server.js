import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// App Config
const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
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

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

// Basic root route
app.get("/", (req, res) => res.send("API is running!"));

// Listen
app.listen(port, () =>
	console.log(`Server listening on http://localhost:${port}`)
);
