import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const userId = parseInt(id); // convert string param to int if your IDs are numbers

    const user = await usersCollection.findOne({ id: userId });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.role === 'admin' || user.email === 'admin@example.com') {
      return NextResponse.json({ message: 'Cannot delete admin user' }, { status: 403 });
    }

    await usersCollection.deleteOne({ id: userId });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}