import { connectDB } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const interview = await MockInterview.create(body);
  return NextResponse.json(interview);
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const mockId = searchParams.get("mockId");

  if (mockId) {
    const interview = await MockInterview.findOne({ mockId });
    return NextResponse.json(interview);
  }

  const interviews = await MockInterview
    .find({ createdBy: email })
    .sort({ _id: -1 });
  return NextResponse.json(interviews);
}