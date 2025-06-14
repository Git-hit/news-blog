import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

// GET /api/categories
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const categories = await db
      .collection('categories')
      .find()
      .sort({ created_at: -1 }) // DESC
      .toArray();

    return NextResponse.json(categories);
  } catch (err) {
    console.error('Fetch categories error:', err);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Name is required and must be a string' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const categories = db.collection('categories');

    // Check for duplicate name
    const exists = await categories.findOne({ name });
    if (exists) {
      return NextResponse.json({ message: 'Category name must be unique' }, { status: 409 });
    }

    const now = new Date();
    const result = await categories.insertOne({
      name,
      created_at: now,
      updated_at: now,
    });

    const inserted = await categories.findOne({ _id: result.insertedId });

    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    console.error('Create category error:', err);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}