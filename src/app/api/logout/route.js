import { NextResponse } from 'next/server';

// POST /api/logout
export async function POST() {
  // No actual server-side session/token to clear
  return NextResponse.json({ message: 'Logged out' }, { status: 200 });
}