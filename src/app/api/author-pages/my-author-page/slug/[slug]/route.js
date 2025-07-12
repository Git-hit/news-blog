import { NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";

// GET
export async function GET(_, { params }) {
  const { slug } = await params;
  try {
    const client = await clientPromise;
    const db = client.db();

    const authorPage = await db
      .collection("authors_pages")
      .findOne({ slug: slug });

    return NextResponse.json(authorPage || {});
  } catch (err) {
    console.error("Fetching author page details encountered an error:", err);
    return NextResponse.json(
      { message: "Failed to fetch author page details" },
      { status: 500 }
    );
  }
}