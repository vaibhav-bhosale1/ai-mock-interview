import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay keys are missing in environment variables.");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let razorpay;

    try {
        // Initialize Razorpay instance
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        console.log("Razorpay initialized successfully");
    } catch (error) {
        console.error("Razorpay initialization error:", error.message);
        return NextResponse.json({ error: "Failed to initialize payment gateway" }, { status: 500 });
    }

    try {
        // Parse request body
        const { amount } = await request.json();

        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid or missing amount" }, { status: 400 });
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to smallest currency unit
            currency: "INR",
            receipt: `receipt_${Math.random().toString(36).substring(7)}`,
        });

        console.log("Razorpay order created successfully:", order);

        // Send success response
        return NextResponse.json({ orderId: order.id, amount: order.amount }, { status: 200 });
    } catch (error) {
        console.error("Error creating Razorpay order:", error.message);

        // Send generic error response
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}
