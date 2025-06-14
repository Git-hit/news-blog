import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch user by email
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Fetch permissions from `permissions` where assigned_to includes user.id
    const permissionsDocs = await db
      .collection('permissions')
      .find({ assigned_to: user.id }) // Note: user.id is the numeric id
      .toArray();

    const permissions = permissionsDocs.map(p => p.name);

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