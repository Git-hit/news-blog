import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET(_, { params }) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ message: 'Post slug required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const comments = await db
      .collection('comments')
      .find({ postSlug: slug, status: "approved" })
      .sort({ created_at: 1 })
      .toArray();

    console.log("Slug: ", slug, "Comments: ", comments);

    return NextResponse.json({ comments });
  } catch (err) {
    console.error('Fetch comments error:', err);
    return NextResponse.json({ message: 'Failed to fetch comments' }, { status: 500 });
  }
}