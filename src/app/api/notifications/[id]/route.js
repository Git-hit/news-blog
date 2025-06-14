import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT /api/notifications/:id
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const { title, link } = await req.json();

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('notifications').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          link: link || null,
          updated_at: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(result.value);
  } catch (err) {
    console.error('Update notification error:', err);
    return NextResponse.json({ message: 'Failed to update notification' }, { status: 500 });
  }
}

// DELETE /api/notifications/:id
export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete notification error:', err);
    return NextResponse.json({ message: 'Failed to delete notification' }, { status: 500 });
  }
}