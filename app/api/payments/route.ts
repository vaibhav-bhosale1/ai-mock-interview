import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Razorpay keys are missing in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const { amount } = await request.json();

    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing amount" },
        { status: 400 }
      );
    }

    // Convert amount into paise
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    });

    return NextResponse.json(
      { orderId: order.id, amount: order.amount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
