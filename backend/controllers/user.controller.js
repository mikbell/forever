import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 1. Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// 2. Check if password is correct
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		// 3. Create and send token
		const token = createToken(user._id);
		res.status(200).json({ success: true, token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// 1. Check if user already exists
		const exists = await User.findOne({ email });
		if (exists) {
			return res
				.status(409) // Use 409 Conflict for resource already exists
				.json({
					success: false,
					message: "User with this email already exists",
				});
		}

		// 2. Validate email format
		if (!validator.isEmail(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid email format" });
		}

		// 3. Password length and strength validation
		if (password.length < 8) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 8 characters long",
			});
		}

		// You might want to customize the strength requirements
		if (
			!validator.isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1, // Default, adjust as needed
			})
		) {
			return res.status(400).json({
				success: false,
				message:
					"Password is not strong enough. It must include at least one uppercase letter, one lowercase letter, one number, and one symbol.",
			});
		}

		// 4. Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// 5. Create new user with hashed password
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword, // Save the HASHED password
		});

		// 6. Generate JWT token
		const token = createToken(newUser._id);

		// 7. Respond with success
		res.status(201).json({
			success: true,
			message: "User registered successfully",
			token,
		});
	} catch (error) {
		console.error("Error during user registration:", error); // Log the full error for debugging
		res.status(500).json({
			success: false,
			message: "Server error during registration",
			error: error.message,
		});
	}
};

export const logout = async (req, res) => {};

export const adminLogin = async (req, res) => {};
