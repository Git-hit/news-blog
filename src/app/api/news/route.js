import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const postsCollection = db.collection('posts');

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const query = {};

    if (category) {
      query.categories = { $elemMatch: { $regex: `^${category}$`, $options: 'i' } };
    }

    const posts = await postsCollection
      .find(query)
      .limit(25)
      .sort({ created_at: -1 }) // newest first
      .toArray();

    return NextResponse.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}