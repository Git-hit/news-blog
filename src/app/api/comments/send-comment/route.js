import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, comment, ['post-slug']: postSlug } = body;

    if (!name || !email || !comment || !postSlug) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const client = await pool.connect();
    await client.query(
      `INSERT INTO comments (name, email, comment, "post-slug", created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [name, email, comment, postSlug]
    );
    client.release();

    return NextResponse.json({ message: 'Comment submitted successfully' }, { status: 201 });
  } catch (err) {
    console.error('Comment submission error:', err);
    return NextResponse.json({ message: 'Failed to submit comment' }, { status: 500 });
  }
}