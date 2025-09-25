const Razorpay = require("razorpay");

// Initialize Razorpay instance (make sure to use your credentials)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,      // or 'YOUR_KEY_ID'
  key_secret: process.env.RAZORPAY_KEY_SECRET, // or 'YOUR_KEY_SECRET'
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // convert INR to paise
      currency,
      receipt: receipt || `receipt_order_${Date.now()}`,
      payment_capture: 1, // auto capture
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      message: "Order generated successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: error.message });
  }
};
