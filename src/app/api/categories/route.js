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

// POST /api/categories
export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Name is required and must be a string' }, { status: 400 });
    }

    const client = await pool.connect();

    // Check for duplicate name
    const exists = await client.query('SELECT 1 FROM categories WHERE name = $1', [name]);
    if (exists.rowCount > 0) {
      client.release();
      return NextResponse.json({ message: 'Category name must be unique' }, { status: 409 });
    }

    const result = await client.query(
      `INSERT INTO categories (name, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       RETURNING *`,
      [name]
    );

    client.release();
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('Create category error:', err);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}