import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
// import clientPromise from '@/src/lib/mongodb'; // optional: for saving contact messages

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, message, country } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@dailytrendnews.in',
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
    });

    const fullName = `${firstName} ${lastName}`;
    const mailText = `
Name: ${fullName}
Email: ${email}
Phone: ${phone || 'N/A'}
Country: ${country || 'N/A'}
Message: ${message}
    `;

    // Send the email
    await transporter.sendMail({
      from: '"Contact Form" <contact@dailytrendnews.in>',
      to: 'contact@dailytrendnews.in',
      subject: 'New Contact Form Submission',
      text: mailText,
    });

    // Optional: save submission in MongoDB
    // try {
    //   const client = await clientPromise;
    //   const db = client.db();
    //   await db.collection('contact_messages').insertOne({
    //     name: fullName,
    //     email,
    //     phone: phone || null,
    //     country: country || null,
    //     message,
    //     created_at: new Date(),
    //   });
    // } catch (mongoErr) {
    //   console.warn('Failed to save message to MongoDB:', mongoErr);
    //   // Still continue even if Mongo fails
    // }

    return NextResponse.json({ message: 'Message received and email sent' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}