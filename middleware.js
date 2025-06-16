import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request) {
  const url = request.nextUrl.clone();

  const token = request.headers.get("authorization")?.replace("Bearer ", "") || request.cookies.get("token")?.value;

  // If token not found, redirect to login
  if (!token) {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // You can optionally attach the decoded user to the request here using headers
    return NextResponse.next();
  } catch (err) {
    // Token invalid or expired → redirect to login
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};