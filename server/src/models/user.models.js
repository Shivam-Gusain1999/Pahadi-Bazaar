import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, default: "" },
        avatar: { type: String, default: "" },
        cartItems: { type: Object, default: {} },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        // Password reset fields
        resetPasswordToken: { type: String },
        resetPasswordExpiry: { type: Date },
    },
    { minimize: false, timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
