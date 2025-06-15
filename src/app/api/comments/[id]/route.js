import { NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Comment ID required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment updated" });
  } catch (err) {
    console.error("PUT comment failed:", err);
    return NextResponse.json({ message: "Failed to update comment" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
    const { id } = params;
  
    if (!id) {
      return NextResponse.json({ message: "Comment ID required" }, { status: 400 });
    }
  
    try {
      const client = await clientPromise;
      const db = client.db();
  
      const result = await db.collection("comments").deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Comment not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Comment deleted" });
    } catch (err) {
      console.error("DELETE comment failed:", err);
      return NextResponse.json({ message: "Failed to delete comment" }, { status: 500 });
    }
}