import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Store this securely in your .env.local

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const permissionsDocs = await db
      .collection('permissions')
      .find({ assigned_to: user.id })
      .toArray();

    const permissions = permissionsDocs.map(p => p.name);

    // ✅ Create JWT token
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      permissions,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // Set expiry as needed

    return NextResponse.json({
      message: 'Logged in',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
      },
      token, // 🔑 Send token to client
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}