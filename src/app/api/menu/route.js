import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

// GET /api/menu
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const menuItems = await db
      .collection('header_settings')
      .find()
      .sort({ order: 1 }) // ascending
      .toArray();

    return NextResponse.json(menuItems);
  } catch (err) {
    console.error('Fetch menu error:', err);
    return NextResponse.json({ message: 'Failed to fetch menu' }, { status: 500 });
  }
}

// POST /api/menu
export async function POST(req) {
  try {
    const { menu } = await req.json();

    if (!Array.isArray(menu)) {
      return NextResponse.json({ message: 'Invalid menu format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const now = new Date();

    // Replace existing menu
    await db.collection('header_settings').deleteMany({});

    const insertItems = menu.map((item, index) => ({
      name: item.name,
      href: item.href,
      order: index,
      created_at: now,
      updated_at: now,
    }));

    await db.collection('header_settings').insertMany(insertItems);

    return NextResponse.json({ message: 'Menu saved successfully' });
  } catch (err) {
    console.error('Save menu error:', err);
    return NextResponse.json({ message: 'Failed to save menu' }, { status: 500 });
  }
}