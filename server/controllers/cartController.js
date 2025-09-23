import User from "../models/user.js";

// authUser middleware se req.user.id aayega
export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;       // frontend sirf cartItems bhejega
    const userId = req.user.id;           // middleware se trusted userId

    // Update cart in database
    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log("Update cart error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
