import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, comment, ['post-slug']: postSlug } = body;

    if (!name || !email || !comment || !postSlug) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection('comments').insertOne({
      name,
      email,
      comment,
      'post-slug': postSlug,
      created_at: new Date(),
    });

    return NextResponse.json({ message: 'Comment submitted successfully' }, { status: 201 });
  } catch (err) {
    console.error('Comment submission error:', err);
    return NextResponse.json({ message: 'Failed to submit comment' }, { status: 500 });
  }
}