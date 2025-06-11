import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const client = await pool.connect();

    // Fetch user by email
    const result = await client.query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      client.release();
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Fetch permissions from `permissions` table where assigned_to contains user's ID
    const permResult = await client.query(
      `SELECT name FROM permissions WHERE assigned_to @> ARRAY[$1]::int[]`,
      [user.id]
    );

    const permissions = permResult.rows.map(p => p.name);

    client.release();

    return NextResponse.json({
      message: 'Logged in',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}