import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true }, // Added trim
		description: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 }, // Price cannot be negative
		images: [
			{
				type: String,
				required: true, // Each image URL is required
			},
		],
		category: {
			type: String,
			required: true,
			// enum: ['Electronics', 'Clothing', 'Books', 'Home Goods'], // Optional: define allowed categories
			trim: true,
		},
		type: {
			type: String,
			required: true,
			// enum: ['T-shirt', 'Jeans', 'Sneakers', 'Laptop'], // Optional: define allowed types
			trim: true,
		},
		sizes: [
			{
				type: String,
				required: true,
				// enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // Optional: define allowed sizes
			},
		],
		bestseller: { type: Boolean, default: false }, // Defaults to false
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
);

const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
