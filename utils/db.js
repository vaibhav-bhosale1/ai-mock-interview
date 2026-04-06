import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://vaibhav:vaibhav@cluster0.bsav5vw.mongodb.net/ai-mock-interview?retryWrites=true&w=majority&appName=Cluster0";

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}