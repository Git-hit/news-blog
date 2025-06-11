import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET /api/footer-settings
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM footer_settings LIMIT 1');
    client.release();

    return NextResponse.json(result.rows[0] || {});
  } catch (err) {
    console.error('Fetch footer settings error:', err);
    return NextResponse.json({ message: 'Failed to fetch footer settings' }, { status: 500 });
  }
}

// POST /api/footer-settings
export async function POST(req) {
  try {
    const { sections } = await req.json();

    if (!Array.isArray(sections)) {
      return NextResponse.json({ message: 'Invalid sections format' }, { status: 400 });
    }

    const client = await pool.connect();
    const existing = await client.query('SELECT id FROM footer_settings LIMIT 1');

    if (existing.rows.length > 0) {
      // Update existing row
      await client.query(
        `UPDATE footer_settings SET sections = $1, updated_at = NOW() WHERE id = $2`,
        [JSON.stringify(sections), existing.rows[0].id]
      );
    } else {
      // Create new row
      await client.query(
        `INSERT INTO footer_settings (sections, created_at, updated_at)
         VALUES ($1, NOW(), NOW())`,
        [JSON.stringify(sections)]
      );
    }

    client.release();
    return NextResponse.json({ message: 'Footer updated' });
  } catch (err) {
    console.error('Update footer settings error:', err);
    return NextResponse.json({ message: 'Failed to update footer settings' }, { status: 500 });
  }
}