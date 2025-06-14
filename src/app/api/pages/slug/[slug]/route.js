import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET(_, { params }) {
  const { slug } = params;

  try {
    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

    const page = await pagesCollection.findOne({ slug });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch page by slug' }, { status: 500 });
  }
}

export async function POST(_, { params }) {
  const { slug } = params;

  try {
    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

    const result = await pagesCollection.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'View count incremented' });
  } catch (err) {
    console.error('Increment error:', err);
    return NextResponse.json({ message: 'Failed to increment views' }, { status: 500 });
  }
}