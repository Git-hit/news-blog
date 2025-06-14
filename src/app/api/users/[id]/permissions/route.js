import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function POST(req, context) {
  const { id } = context.params;
  const userId = parseInt(id); // assuming id is numeric (not MongoDB ObjectId)

  try {
    const { permission } = await req.json();
    if (!permission) {
      return NextResponse.json({ message: 'Permission name required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const permissionsCollection = db.collection('permissions');

    // Check if permission exists
    const permDoc = await permissionsCollection.findOne({ name: permission });
    if (!permDoc) {
      return NextResponse.json({ message: 'Invalid permission' }, { status: 400 });
    }

    const alreadyAssigned = permDoc.assigned_to?.includes(userId);

    if (alreadyAssigned) {
      // Revoke permission
      await permissionsCollection.updateOne(
        { name: permission },
        { $pull: { assigned_to: userId } }
      );
      return NextResponse.json({ message: 'Permission revoked' });
    } else {
      // Grant permission
      await permissionsCollection.updateOne(
        { name: permission },
        { $addToSet: { assigned_to: userId } } // avoids duplicates
      );
      return NextResponse.json({ message: 'Permission granted' });
    }
  } catch (err) {
    console.error('Toggle permission error:', err);
    return NextResponse.json({ message: 'Failed to toggle permission' }, { status: 500 });
  }
}