import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

const currency = "EUR";
const deliveryCharge = 10;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const stripe = new Stripe(STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
	try {
		const { items, amount, address } = req.body;
		const newOrder = new Order({
			userId: req.user.id,
			items,
			amount,
			address,
			status: "In Attesa di Pagamento",
			paymentMethod: "cod",
			payment: false,
			date: Date.now(),
		});

		await newOrder.save();
		await User.findByIdAndUpdate(req.user.id, { cartData: {} }); // Svuota il carrello
		res.json({ success: true, message: "Ordine effettuato con successo" });
	} catch (error) {
		console.error("Errore in placeOrder (COD):", error);
		res
			.status(500)
			.json({ success: false, message: "Errore interno del server" });
	}
};

export const placeOrderStripe = async (req, res) => {
	try {
		const { items, address, amount } = req.body;

		// --> 1. Crea un ordine temporaneo nel DB
		const newOrder = new Order({
			userId: req.user.id,
			items,
			amount,
			address,
			status: "In Attesa di Pagamento", // Stato speciale per l'ordine non ancora pagato
			paymentMethod: "stripe",
			date: Date.now(),
		});
		await newOrder.save();

		const line_items = items.map((item) => ({
			price_data: {
				currency: currency,
				product_data: {
					name: item.name,
					description: item.description,
					images: [item.image],
				},
				unit_amount: item.price * 100,
			},
			quantity: item.quantity,
		}));

		line_items.push({
			price_data: {
				currency: currency,
				product_data: {
					name: "Spese di consegna",
					description: "Spese di consegna",
				},
				unit_amount: deliveryCharge * 100,
			},
			quantity: 1,
		});

		const session = await stripe.checkout.sessions.create({
			line_items,
			mode: "payment",
			success_url: `${FRONTEND_URL}/orders?success=true`,
			cancel_url: `${FRONTEND_URL}/cart?canceled=true`,
			metadata: {
				orderId: newOrder._id.toString(), // Converti l'ObjectId in stringa
			},
		});

		res.json({ success: true, session_url: session.url });
	} catch (error) {
		console.error("Errore in placeOrderStripe:", error);
		res.status(500).json({
			success: false,
			message: "Errore nella creazione della sessione di pagamento",
		});
	}
};

// --- Handler per il Webhook di Stripe ---

export const verifyOrder = async (req, res) => {
	const sig = req.headers["stripe-signature"];
	let event;

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;
		// --> 3. Recupera l'ID dell'ordine dai metadati
		const orderId = session.metadata.orderId;

		try {
			// Trova l'ordine temporaneo
			const order = await Order.findById(orderId);
			if (order && order.status === "In Attesa di Pagamento") {
				// --> 4. Rendi l'ordine permanente e pagato
				order.payment = true;
				order.status = "In Lavorazione";
				await order.save();

				// Svuota il carrello dell'utente
				await User.findByIdAndUpdate(order.userId, { cartData: {} });
			} else {
				console.log("Ordine non trovato o già processato:", orderId);
			}
		} catch (error) {
			console.error(
				"Errore nell'aggiornamento dell'ordine post-pagamento:",
				error
			);
			// Qui potresti voler aggiungere una logica per gestire l'errore,
			// anche se il pagamento è andato a buon fine
		}
	}

	res.json({ received: true });
};

export const allOrders = async (req, res) => {
	try {
		const orders = await Order.find({}).populate("userId", "name email");
		res.json({ success: true, orders });
	} catch (error) {
		console.error("Errore in allOrders:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const userOrders = async (req, res) => {
	try {
		const userId = req.user.id;
		const orders = await Order.find({ userId });
		res.json({ success: true, orders });
	} catch (error) {
		console.error("Errore in userOrders:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const updateStatus = async (req, res) => {
	try {
		const { orderId, status } = req.body;
		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{ status },
			{ new: true }
		);
		res.json({ success: true, updatedOrder });
	} catch (error) {
		console.error("Errore in updateStatus:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};
