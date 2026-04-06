import { connectDB } from "../../../utils/db";
import { UserAnswer } from "../../../utils/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const answer = await UserAnswer.create(body);
  return NextResponse.json(answer);
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const mockId = searchParams.get("mockId");

  const answers = await UserAnswer
    .find({ mockIdRef: mockId })
    .sort({ _id: 1 });
  return NextResponse.json(answers);
}