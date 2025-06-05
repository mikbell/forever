import User from "../models/user.model.js";

export const getCart = async (req, res) => {
	try {
		const { userId } = req.body;

		// 1. Validazione di base dell'ID utente
		if (!userId) {
			return res
				.status(400)
				.json({ success: false, message: "User ID is required." });
		}

		// 2. Trova l'utente e seleziona solo il campo 'cartData'
		const userData = await User.findById(userId).select("cartData");

		// 3. Gestione del caso in cui l'utente non esista
		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}

		const cartData = userData.cartData || {};

		res.status(200).json({ success: true, cartData });
	} catch (error) {
		console.error("Error fetching cart:", error);
		res.status(500).json({
			success: false,
			message: "Server error fetching cart. Please try again later.",
		});
	}
};

export const addToCart = async (req, res) => {
	try {
		const { userId, itemId, size } = req.body;

		// 1. Validazione degli input
		if (!userId || !itemId || !size) {
			return res.status(400).json({
				success: false,
				message: "User ID, Item ID, and Size are required.",
			});
		}

		// 2. Trova l'utente
		const userData = await User.findById(userId);

		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}

		let cartData = userData.cartData || {};

		// 3. Logica per aggiungere o incrementare l'articolo nel carrello
		// Verifica se l'itemId esiste
		if (!cartData[itemId]) {
			cartData[itemId] = {}; // Se non esiste, crea un oggetto per l'articolo
		}

		// Incrementa la quantità per la taglia specifica
		cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

		// 4. Aggiorna il carrello nel database in modo più efficiente
		await User.findByIdAndUpdate(userId, { $set: { cartData: cartData } });

		res
			.status(200)
			.json({ success: true, message: "Item added to cart successfully." });
	} catch (error) {
		console.error("Error adding item to cart:", error);
		res.status(500).json({
			success: false,
			message: "Server error adding item to cart. Please try again later.",
		});
	}
};

export const updateCart = async (req, res) => {
	try {
		const { userId, itemId, size, quantity } = req.body;

		// 1. Validazione degli input
		if (!userId || !itemId || !size || quantity === undefined || quantity < 0) {
			return res.status(400).json({
				success: false,
				message:
					"User ID, Item ID, Size, and a non-negative Quantity are required.",
			});
		}

		// 2. Trova l'utente
		const userData = await User.findById(userId);

		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}

		let cartData = userData.cartData || {};

		// 3. Logica per aggiornare l'articolo nel carrello
		if (quantity === 0) {
			if (cartData[itemId] && cartData[itemId][size]) {
				delete cartData[itemId][size];
				if (Object.keys(cartData[itemId]).length === 0) {
					delete cartData[itemId];
				}
			}
		} else {
			if (!cartData[itemId]) {
				cartData[itemId] = {};
			}
			cartData[itemId][size] = quantity;
		}

		// 4. Aggiorna il carrello nel database
		await User.findByIdAndUpdate(userId, { $set: { cartData: cartData } });

		res
			.status(200)
			.json({ success: true, message: "Cart updated successfully." });
	} catch (error) {
		console.error("Error updating cart:", error);
		res.status(500).json({
			success: false,
			message: "Server error updating cart. Please try again later.",
		});
	}
};
