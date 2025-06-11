import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const body = await req.json();
  const { firstName, lastName, email, phone, message, country } = body;

  // Validate input
  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  // Create a transporter (adjust these values with your SMTP credentials)
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // or your SMTP provider
    port: 465,
    secure: true,
    auth: {
      user: 'contact@dailytrendnews.in',
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
  });

  // Send email
  try {
    await transporter.sendMail({
      from: '"Contact Form" <contact@dailytrendnews.in>',
      to: 'contact@dailytrendnews.in',
      subject: 'New Contact Form Submission',
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        Country: ${country || 'N/A'}
        Message: ${message}
      `,
    });

    return NextResponse.json({ message: 'Message received and email sent' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}