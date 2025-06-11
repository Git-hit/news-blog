import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

// GET /api/users
export async function GET() {
  try {
    const client = await pool.connect();

    const usersRes = await client.query(`
      SELECT u.id, u.name, u.email, u.role,
        COALESCE(
          (SELECT json_agg(p.name)
           FROM permissions p
           WHERE p.assigned_to @> ARRAY[u.id]::int[]
          ), '[]'
        ) AS permissions
      FROM users u
      ORDER BY u.id
    `);

    client.release();
    return NextResponse.json({ users: usersRes.rows });
  } catch (err) {
    console.error('Fetch users error:', err);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(req) {
  try {
    const { name, email, password, permissions } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password required' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const client = await pool.connect();

    // insert new user
    const userRes = await client.query(
      `INSERT INTO users (name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, role`,
      [name, email, hashed, 'user']
    );
    const user = userRes.rows[0];
    const userId = user.id;

    // assign permissions if provided
    if (Array.isArray(permissions)) {
      for (const permName of permissions) {
        await client.query(
          `UPDATE permissions
           SET assigned_to = array_append(assigned_to, $1)
           WHERE name = $2 AND NOT assigned_to @> ARRAY[$1]`,
          [userId, permName]
        );
      }
    }

    client.release();
    return NextResponse.json({ message: 'User created', user }, { status: 201 });
  } catch (err) {
    console.error('Create user error:', err);
    if (err.code === '23505') {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
  }
}