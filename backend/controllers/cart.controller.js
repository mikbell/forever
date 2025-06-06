import User from "../models/user.model.js";

export const getCart = async (req, res) => {
	try {
		const userId = req.user.id;

		const userData = await User.findById(userId);
		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "Utente non trovato" });
		}

		const cartData = userData.cartData || {};
		res.json({ success: true, cartData });
	} catch (error) {
		console.error("Errore in getCart:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const userId = req.user.id;
		const { itemId, size } = req.body;

		if (!itemId || !size) {
			return res
				.status(400)
				.json({ success: false, message: "Dati mancanti o non validi" });
		}

		const userData = await User.findById(userId);
		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "Utente non trovato" });
		}

		const fieldToUpdate = `cartData.${itemId}.${size}`;
		await User.findByIdAndUpdate(userId, { $inc: { [fieldToUpdate]: 1 } });

		res.json({ success: true, message: "Prodotto aggiunto al carrello" });
	} catch (error) {
		console.error("Errore in addToCart:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const updateCart = async (req, res) => {
	try {
		const userId = req.user.id;
		const { itemId, size, quantity } = req.body;

		if (!itemId || !size || quantity == null || quantity < 0) {
			return res
				.status(400)
				.json({ success: false, message: "Dati mancanti o non validi" });
		}

		const userData = await User.findById(userId);
		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "Utente non trovato" });
		}

		const cartData = userData.cartData || {};
		const fieldToUpdate = `cartData.${itemId}.${size}`;

		if (quantity === 0) {
			if (cartData[itemId] && cartData[itemId][size] !== undefined) {
				delete cartData[itemId][size];
				if (Object.keys(cartData[itemId]).length === 0) {
					delete cartData[itemId];
				}
			}
		} else {
			if (!cartData[itemId]) cartData[itemId] = {};
			cartData[itemId][size] = quantity;
		}

		await User.findByIdAndUpdate(userId, { $set: { cartData: cartData } });

		res.json({ success: true, message: "Carrello aggiornato" });
	} catch (error) {
		console.error("Errore in updateCart:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const removeFromCart = async (req, res) => {
	try {
		const userId = req.user.id;
		const { itemId, size } = req.body;

		if (!itemId || !size) {
			return res
				.status(400)
				.json({ success: false, message: "Dati mancanti o non validi" });
		}

		const fieldToRemove = `cartData.${itemId}.${size}`;
		await User.findByIdAndUpdate(userId, { $unset: { [fieldToRemove]: "" } });

		res.json({ success: true, message: "Prodotto rimosso dal carrello" });
	} catch (error) {
		console.error("Errore in removeFromCart:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const clearCart = async (req, res) => {
	try {
		const userId = req.user.id; 
		await User.findByIdAndUpdate(userId, { $set: { cartData: {} } });

		res.json({ success: true, message: "Carrello svuotato" });
	} catch (error) {
		console.error("Errore in clearCart:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};
