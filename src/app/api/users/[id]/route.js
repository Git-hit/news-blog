import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const client = await pool.connect();

    // Check role or admin email
    const res = await client.query('SELECT email, role FROM users WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const { email, role } = res.rows[0];
    if (role === 'admin' || email === 'admin@example.com') {
      client.release();
      return NextResponse.json({ message: 'Cannot delete admin user' }, { status: 403 });
    }

    await client.query('DELETE FROM users WHERE id = $1', [id]);
    client.release();
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}