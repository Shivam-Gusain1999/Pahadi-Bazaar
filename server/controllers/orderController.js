import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";


//  stripe gateway Initialize // 
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------- COD ORDER ----------------
export const placeOrderCod = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // amount calculate 
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      amount += product.offerPrice * item.quantity;
    }
    amount += Math.floor(amount * 0.02); // 2% tax add

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "order placed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- STRIPE ORDER ----------------
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    let amount = 0;

    // amount calculate + product data prepare
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

    amount += Math.floor(amount * 0.02); // 2% tax add

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });



    // create line items for stripe

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });



    // create stripe session //

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

    // frontend ko session id bhejna zaroori hai

    return res.json({
      success: true,
      message: "Stripe session created",
      url: session.url,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


/// stripeWebHooks /// 

export const stripeWebhooks = async (request, response) => {
    // Stripe Gateway Initialize
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
        response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // handle the event //

   switch (event.type) {
    case "payment_intent.succeeded":{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting Session Metadata
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        });

        const {
            orderId,
            userId
        } = session.data[0].metadata;
        // Mark Payment as Paid
        await Order.findByIdAndUpdate(orderId, {
            isPaid: true
        });
        // Clear user cart
        await User.findByIdAndUpdate(userId, {
            cartItems: {}
        });
        break;
}
case "payment_intent.payment_failed": {
   const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting Session Metadata
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        });

        const { orderId } = session.data[0].metadata;
        await Order.findByIdAndDelete(orderId);
        break;
}

default:
  console.error(`Unhandled event type ${event.type}`)
  break;
   }
   response.json({received:true})
};





//  GET USER ORDERS //


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//  GET ALL ORDERS //


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
