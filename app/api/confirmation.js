import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  const webhookSecret = process.env.NEXT_PUBLIC_RAZORPAY_WEBHOOK_SECRET;
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (generatedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const paymentData = event.payload.payment.entity;

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another email provider
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: paymentData.email,
      subject: "Payment Confirmation",
      text: `Hi ${paymentData.name},\n\nYour payment of ₹${paymentData.amount / 100} was successful.\n\nThank you for your support!\n\nBest Regards,\nVirtueHire Team`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
