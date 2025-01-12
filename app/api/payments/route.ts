import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay keys are missing in environment variables.");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let razorpay;

    try {
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
        const { amount } = await request.json();
        console.log("Received amount from frontend:", amount);  // Log the amount from frontend

        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid or missing amount" }, { status: 400 });
        }

        // Convert the amount into paise (smallest currency unit)
        const amountInPaise = amount * 100;  // Convert INR to paise
        console.log("Converted amount in paise:", amountInPaise);  // Log the converted amount

        const order = await razorpay.orders.create({
            amount: amountInPaise,  // Razorpay requires amount in paise
            currency: "INR",
            receipt: `receipt_${Math.random().toString(36).substring(7)}`,
        });

        console.log("Razorpay order created successfully:", order);

        return NextResponse.json({ orderId: order.id, amount: order.amount }, { status: 200 });
    } catch (error) {
        console.error("Error creating Razorpay order:", error.message);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}
