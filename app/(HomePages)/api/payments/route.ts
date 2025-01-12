import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    let body;
    try {
        // Attempt to parse the request body
        body = await request.json();
    } catch (error) {
        console.error("Failed to parse JSON body:", error);
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    try {
        const { amount } = body;

        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to smallest currency unit
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });

        return NextResponse.json({ orderId: order.id, amount: order.amount }, { status: 200 });
    } catch (error) {
        console.error("Error creating Razorpay order:", error.message);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}
