import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(_, { params }) {
  const { slug } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM pages WHERE slug = $1', [slug]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page: result.rows[0] });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch page by slug' }, { status: 500 });
  }
}

export async function POST(_, { params }) {
  const { slug } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('UPDATE pages SET views = views + 1 WHERE slug = $1 RETURNING *', [slug]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'View count incremented' });
  } catch (err) {
    console.error('Increment error:', err);
    return NextResponse.json({ message: 'Failed to increment views' }, { status: 500 });
  }
}