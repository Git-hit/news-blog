import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET /api/notifications
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM notifications ORDER BY created_at DESC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST /api/notifications
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, link } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO notifications (title, link, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [title, link || null]
    );
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('Create notification error:', err);
    return NextResponse.json({ message: 'Failed to create notification' }, { status: 500 });
  }
}