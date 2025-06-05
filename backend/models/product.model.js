import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 },
		images: [
			{
				type: String,
				required: true,
			},
		],
		category: {
			type: String,
			required: true,
			trim: true,
		},
		type: {
			type: String,
			required: true,
			trim: true,
		},
		sizes: [
			{
				type: String,
				required: true,
			},
		],
		bestseller: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
