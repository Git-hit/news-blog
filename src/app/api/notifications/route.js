import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const notifications = await db
      .collection('notifications')
      .find()
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(notifications);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, link } = await req.json();

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const newNotification = {
      title,
      link: link || null,
      created_at: new Date(),
    };

    const result = await db.collection('notifications').insertOne(newNotification);

    return NextResponse.json({ _id: result.insertedId, ...newNotification }, { status: 201 });
  } catch (err) {
    console.error('Create notification error:', err);
    return NextResponse.json({ message: 'Failed to create notification' }, { status: 500 });
  }
}