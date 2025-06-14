import { NextResponse } from 'next/server';
// import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';
import clientPromise from '@/src/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // use default or pass db name if needed

    const users = await db.collection('users').find().toArray();

    const permissionsCollection = db.collection('permissions');

    const usersWithPermissions = await Promise.all(
      users.map(async (user) => {
        const permissions = await permissionsCollection
          .find({ assigned_to: user.id }) // match by int user.id
          .project({ name: 1, _id: 0 })
          .toArray();

        return {
          ...user,
          permissions: permissions.map((p) => p.name),
        };
      })
    );

    return NextResponse.json({ users: usersWithPermissions });
  } catch (err) {
    console.error('Fetch users error:', err);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email, password, permissions } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const permissionsCollection = db.collection('permissions');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate a new integer ID manually if you're keeping numeric IDs
    const lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).next();
    const newId = lastUser ? lastUser.id + 1 : 1;

    const now = new Date();

    const newUser = {
      _id: new ObjectId(), // optional, Mongo will auto-generate if omitted
      id: newId,
      name,
      email,
      password: hashed,
      role: 'user',
      created_at: now,
      updated_at: now,
    };

    await usersCollection.insertOne(newUser);

    // Assign permissions if provided
    if (Array.isArray(permissions)) {
      for (const permName of permissions) {
        await permissionsCollection.updateOne(
          { name: permName },
          { $addToSet: { assigned_to: newId } }
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ message: 'User created', user: userWithoutPassword }, { status: 201 });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
  }
}