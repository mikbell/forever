import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	items: { type: Array, required: true },
	amount: { type: Number, required: true },
	address: { type: Object, required: true },
	status: {
		type: String,
		enum: [
			"In Attesa di Pagamento",
			"In Lavorazione",
			"In Transito",
			"Consegnato",
		],
		default: "In Lavorazione",
	},
	paymentMethod: { type: String, required: true },
	payment: { type: Boolean, required: true, default: false },
	date: { type: Number, required: true },
});

orderSchema.index(
	{ createdAt: 1 },
	{
		expireAfterSeconds: 3600,
		partialFilterExpression: { status: "In Attesa di Pagamento" },
	}
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
