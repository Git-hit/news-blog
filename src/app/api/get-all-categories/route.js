import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

// GET /api/categories
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const categories = await db
      .collection('categories')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(categories);
  } catch (err) {
    console.error('Fetch categories error:', err);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}