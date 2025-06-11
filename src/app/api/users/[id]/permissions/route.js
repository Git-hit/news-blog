import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function POST(req, context) {
    const { id } = context.params;

  try {
    const { permission } = await req.json();
    if (!permission) {
      return NextResponse.json({ message: 'Permission name required' }, { status: 400 });
    }

    const client = await pool.connect();

    // Check valid permission exists
    const permRes = await client.query('SELECT 1 FROM permissions WHERE name = $1', [permission]);
    if (permRes.rowCount === 0) {
      client.release();
      return NextResponse.json({ message: 'Invalid permission' }, { status: 400 });
    }

    // Check if user already has it
    const hasRes = await client.query(
      `SELECT 1 FROM permissions
       WHERE name = $1 AND assigned_to @> ARRAY[$2::int]`,
      [permission, id]
    );

    if (hasRes.rowCount > 0) {
      // revoke
      await client.query(
        `UPDATE permissions
         SET assigned_to = array_remove(assigned_to, $1::int)
         WHERE name = $2`,
        [id, permission]
      );
      client.release();
      return NextResponse.json({ message: 'Permission revoked' });
    } else {
      // grant
      await client.query(
        `UPDATE permissions
         SET assigned_to = array_append(assigned_to, $1::int)
         WHERE name = $2`,
        [id, permission]
      );
      client.release();
      return NextResponse.json({ message: 'Permission granted' });
    }
  } catch (err) {
    console.error('Toggle permission error:', err);
    return NextResponse.json({ message: 'Failed to toggle permission' }, { status: 500 });
  }
}