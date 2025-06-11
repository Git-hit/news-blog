import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET /api/categories
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM categories ORDER BY created_at DESC');
    client.release();

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Fetch categories error:', err);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}