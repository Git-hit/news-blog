import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

// GET /api/footer-settings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const footer = await db
      .collection('footer_settings')
      .findOne({}, { sort: { updated_at: -1 } });

    return NextResponse.json(footer || {});
  } catch (err) {
    console.error('Fetch footer settings error:', err);
    return NextResponse.json({ message: 'Failed to fetch footer settings' }, { status: 500 });
  }
}

// POST /api/footer-settings
export async function POST(req) {
  try {
    const { sections } = await req.json();

    if (!Array.isArray(sections)) {
      return NextResponse.json({ message: 'Invalid sections format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const now = new Date();

    // Check if a document already exists
    const existing = await db.collection('footer_settings').findOne();

    if (existing) {
      // Update the existing document
      await db.collection('footer_settings').updateOne(
        { _id: existing._id },
        { $set: { sections, updated_at: now } }
      );
    } else {
      // Insert a new document
      await db.collection('footer_settings').insertOne({
        sections,
        created_at: now,
        updated_at: now,
      });
    }

    return NextResponse.json({ message: 'Footer updated' });
  } catch (err) {
    console.error('Update footer settings error:', err);
    return NextResponse.json({ message: 'Failed to update footer settings' }, { status: 500 });
  }
}