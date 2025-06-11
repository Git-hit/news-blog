import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET /api/menu
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM header_settings ORDER BY "order" ASC');
    client.release();

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Fetch menu error:', err);
    return NextResponse.json({ message: 'Failed to fetch menu' }, { status: 500 });
  }
}

// POST /api/menu
export async function POST(req) {
  try {
    const body = await req.json();
    const menu = body.menu;

    if (!Array.isArray(menu)) {
      return NextResponse.json({ message: 'Invalid menu format' }, { status: 400 });
    }

    const client = await pool.connect();

    // Clear existing menu
    await client.query('TRUNCATE TABLE header_settings RESTART IDENTITY');

    // Insert new menu items
    const insertPromises = menu.map((item, index) => {
      return client.query(
        `INSERT INTO header_settings (name, href, "order", created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [item.name, item.href, index]
      );
    });

    await Promise.all(insertPromises);
    client.release();

    return NextResponse.json({ message: 'Menu saved successfully' });
  } catch (err) {
    console.error('Save menu error:', err);
    return NextResponse.json({ message: 'Failed to save menu' }, { status: 500 });
  }
}