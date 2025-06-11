import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET /api/permissions
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM permissions ORDER BY id');
    client.release();

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching permissions:', err);
    return NextResponse.json({ message: 'Failed to fetch permissions' }, { status: 500 });
  }
}