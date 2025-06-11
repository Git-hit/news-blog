import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(_, { params }) {
  const { slug } = params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM comments WHERE "post-slug" = $1 ORDER BY created_at ASC',
      [slug]
    );
    client.release();

    return NextResponse.json({ comments: result.rows });
  } catch (err) {
    console.error('Fetch comments error:', err);
    return NextResponse.json({ message: 'Failed to fetch comments' }, { status: 500 });
  }
}