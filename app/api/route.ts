import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const { amount } = await request.json(); // Fetch amount from the request body
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to smallest currency unit
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });
        return NextResponse.json({ orderId: order.id, amount: order.amount }, { status: 200 });
    } catch (error) {
        console.error("Error creating order", error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}
