import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// PUT /api/notifications/:id
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();
    const { title, link } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      `UPDATE notifications SET title = $1, link = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [title, link || null, id]
    );

    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Update notification error:', err);
    return NextResponse.json({ message: 'Failed to update notification' }, { status: 500 });
  }
}

// DELETE /api/notifications/:id
export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM notifications WHERE id = $1', [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete notification error:', err);
    return NextResponse.json({ message: 'Failed to delete notification' }, { status: 500 });
  }
}