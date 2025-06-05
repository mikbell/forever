import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Assicurati che il percorso sia corretto per il tuo modello User

/**
 * @desc Middleware for authenticating and authorizing admin users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminAuth = async (req, res, next) => {
	try {
		// 1. Get the token from cookies
		const token = req.cookies.jwt;

		// 2. Check if token exists
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized: No token provided." });
		}

		// 3. Verify the token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			// Handle specific JWT errors (e.g., expired, invalid signature)
			if (err.name === "TokenExpiredError") {
				return res
					.status(401)
					.json({ success: false, message: "Unauthorized: Token expired." });
			}
			if (err.name === "JsonWebTokenError") {
				return res
					.status(401)
					.json({ success: false, message: "Unauthorized: Invalid token." });
			}
			// Catch any other unexpected JWT errors
			console.error("JWT verification error:", err);
			return res.status(401).json({
				success: false,
				message: "Unauthorized: Token verification failed.",
			});
		}

		// 4. Find the user by ID from the decoded token
		const user = await User.findById(decoded.id).select("-password"); // Exclude password from the fetched user object

		// 5. Check if user exists
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Unauthorized: User not found." });
		}

		// 6. Check if the user is an admin
		if (!user.isAdmin) {
			return res.status(403).json({
				success: false,
				message: "Forbidden: User is not an administrator.",
			});
		}

		// 7. Attach the user object to the request for subsequent middleware/controllers
		req.user = user;

		// 8. Proceed to the next middleware or route handler
		next();
	} catch (error) {
		// Catch any unexpected server errors
		console.error("Server error in admin authentication middleware:", error);
		res
			.status(500)
			.json({ success: false, message: "Server error during authentication." });
	}
};

export default adminAuth;
