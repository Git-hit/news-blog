import { NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";

// GET
export async function GET(_, { params }) {
  const { email } = await params;
  try {
    const client = await clientPromise;
    const db = client.db();

    const authorPage = await db
      .collection("authors_pages")
      .findOne({ author: email });

    return NextResponse.json(authorPage || {});
  } catch (err) {
    console.error("Fetching author page details encountered an error:", err);
    return NextResponse.json(
      { message: "Failed to fetch author page details" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req) {
  try {
    const { data, email } = await req.json();
    const { title, content, slug } = data;

    if (!slug || !slug.trim()) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const now = new Date();

    // Check if the slug is already used by another user
    const existingSlug = await db.collection("authors_pages").findOne({
      slug: slug,
      author: { $ne: email }, // not the same user
    });

    if (existingSlug) {
      return NextResponse.json(
        { message: "Slug is already taken by another author" },
        { status: 409 }
      );
    }

    // Check if this author already has a page
    const existing = await db
      .collection("authors_pages")
      .findOne({ author: email });

    if (existing) {
      await db.collection("authors_pages").updateOne(
        { _id: existing._id },
        {
          $set: {
            title,
            content,
            slug, // update slug if needed
            updated_at: now,
          },
        }
      );
    } else {
      await db.collection("authors_pages").insertOne({
        title,
        content,
        slug,
        author: email,
        created_at: now,
        updated_at: now,
      });
    }

    return NextResponse.json({ message: "Author page saved successfully" });
  } catch (err) {
    console.error("Author page save error:", err);
    return NextResponse.json(
      { message: "Failed to save author page" },
      { status: 500 }
    );
  }
}