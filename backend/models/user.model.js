import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false, required: true },
		cartData: { type: Object, default: {} },
	},
	{ timestamps: true },
	{ minimized: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
