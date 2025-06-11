import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET /api/settings
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM settings');
    client.release();

    const settings = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return NextResponse.json(settings);
  } catch (err) {
    console.error('Fetch settings error:', err);
    return NextResponse.json({ message: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST /api/settings
export async function POST(req) {
  try {
    const settings = await req.json();

    const client = await pool.connect();

    for (const [key, value] of Object.entries(settings)) {
      await client.query(
        `
          INSERT INTO settings (key, value)
          VALUES ($1, $2)
          ON CONFLICT (key)
          DO UPDATE SET value = EXCLUDED.value
        `,
        [key, value]
      );
    }

    client.release();
    return NextResponse.json({ message: 'Settings updated successfully.' });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}