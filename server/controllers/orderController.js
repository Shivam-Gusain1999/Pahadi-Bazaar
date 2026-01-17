import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS, TAX_RATE } from "../constants/index.js";

// Stripe Gateway Initialize
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Place order with Cash on Delivery
 * @route   POST /api/order/cod
 * @access  Private
 */
export const placeOrderCod = asyncHandler(async (req, res) => {
  const { items, address } = req.body;
  const userId = req.user.id;

  // Validate request data
  if (!address || !items || items.length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Address and items are required");
  }

  // Calculate total amount
  let amount = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    amount += product.offerPrice * item.quantity;
  }

  // Add tax
  amount += Math.floor(amount * TAX_RATE);

  // Create order
  const order = await Order.create({
    userId,
    items,
    amount,
    address,
    paymentType: "COD",
  });

  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, { order }, "Order placed successfully")
  );
});

/**
 * @desc    Place order with Stripe payment
 * @route   POST /api/order/stripe
 * @access  Private
 */
export const placeOrderStripe = asyncHandler(async (req, res) => {
  const { items, address } = req.body;
  const userId = req.user.id;
  const { origin } = req.headers;

  // Validate request data
  if (!address || !items || items.length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Address and items are required");
  }

  let productData = [];
  let amount = 0;

  // Calculate amount and prepare product data
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    productData.push({
      name: product.name,
      price: product.offerPrice,
      quantity: item.quantity,
    });

    amount += product.offerPrice * item.quantity;
  }

  // Add tax
  amount += Math.floor(amount * TAX_RATE);

  // Create order in database
  const order = await Order.create({
    userId,
    items,
    amount,
    address,
    paymentType: "Online",
  });

  // Create Stripe line items
  const line_items = productData.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.floor(item.price + item.price * TAX_RATE) * 100,
    },
    quantity: item.quantity,
  }));

  // Create Stripe checkout session
  const session = await stripeInstance.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${origin}/loader?next=my-orders`,
    cancel_url: `${origin}/cart`,
    metadata: {
      orderId: order._id.toString(),
      userId,
    },
  });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { url: session.url }, "Stripe session created")
  );
});

/**
 * @desc    Handle Stripe webhook events
 * @route   POST /stripe
 * @access  Public (Stripe)
 */
export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Get session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;

      // Mark payment as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      // Clear user cart
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Get session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;

      // Delete failed order
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }

  response.json({ received: true });
};

/**
 * @desc    Get orders for logged in user
 * @route   GET /api/order/user
 * @access  Private
 */
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.find({
    userId,
    $or: [{ paymentType: "COD" }, { isPaid: true }],
  })
    .populate("items.product address")
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { orders }, "Orders fetched successfully")
  );
});

/**
 * @desc    Get all orders (Seller)
 * @route   GET /api/order/seller
 * @access  Private (Seller)
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    $or: [{ paymentType: "COD" }, { isPaid: true }],
  })
    .populate("items.product address")
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { orders }, "All orders fetched successfully")
  );
});
