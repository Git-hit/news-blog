import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

// GET /api/settings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const settingsCollection = db.collection('settings');

    const allSettings = await settingsCollection.find().toArray();

    const settings = allSettings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    return NextResponse.json(settings);
  } catch (err) {
    console.error('Fetch settings error:', err);
    return NextResponse.json({ message: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST /api/settings
export async function POST(req) {
  try {
    const settings = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const settingsCollection = db.collection('settings');

    const bulkOps = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value } },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await settingsCollection.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: 'Settings updated successfully.' });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}