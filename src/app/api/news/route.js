import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const posts = await db
      .collection('posts')
      .find()
      .limit(25)
      .sort({ created_at: -1 }) // descending
      .toArray();

    return NextResponse.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}