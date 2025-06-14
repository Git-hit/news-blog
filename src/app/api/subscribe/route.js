import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import clientPromise from '@/src/lib/mongodb';

export async function POST(req) {
  const body = await req.json();
  const { email } = body;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const subscribers = db.collection('subscribers');

  try {
    const exists = await subscribers.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 422 }
      );
    }

    // Insert into MongoDB
    await subscribers.insertOne({ email });

    // Send notification email
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@dailytrendnews.in',
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Newsletter" <contact@dailytrendnews.in>',
      to: 'contact@dailytrendnews.in',
      subject: 'New Newsletter Subscriber',
      text: `New newsletter subscriber: ${email}`,
    });

    return NextResponse.json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}