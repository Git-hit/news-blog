import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
    client.release();

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}