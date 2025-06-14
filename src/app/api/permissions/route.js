import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const permissionsCollection = db.collection('permissions');

    const permissions = await permissionsCollection.find().sort({ id: 1 }).toArray();

    return NextResponse.json(permissions);
  } catch (err) {
    console.error('Error fetching permissions:', err);
    return NextResponse.json({ message: 'Failed to fetch permissions' }, { status: 500 });
  }
}