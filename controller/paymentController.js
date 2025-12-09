import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkOrderPayment = async (req, res) => {
  try {
    const { cardHolderName, cardNumber, expiration, CVV, totalAmount } = req.body;
    
    console.log("Payment attempt:", { cardHolderName, totalAmount });
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always return success for testing
    res.status(200).json({
      success: true,
      message: "Payment successful! (Test Mode)",
      paymentId: `pi_${Date.now()}`,
      amount: totalAmount,
      cardLast4: cardNumber.slice(-4),
    });
    
  } catch (error) {
    console.error("Payment error:", error);
    res.status(200).json({ // Still return 200 but with failure
      success: false,
      error: "Payment declined. Use card 4242 4242 4242 4242 for testing",
    });
  }
};