import { NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";

// GET: All comments (for admin)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const comments = await db.collection("comments").find().sort({ created_at: -1 }).toArray();

    return NextResponse.json(comments);
  } catch (err) {
    console.error("GET comments failed:", err);
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}