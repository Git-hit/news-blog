import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json();
  const { email } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const exists = await client.query(
      "SELECT 1 FROM subscribers WHERE email = $1",
      [email]
    );

    if (exists.rows.length > 0) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 422 }
      );
    }

    // Store in DB
    await client.query("INSERT INTO subscribers(email) VALUES($1)", [email]);

    // Send notification email
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // or your SMTP provider
      port: 465,
      secure: true,
      auth: {
        user: "contact@dailytrendnews.in",
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Newsletter" <contact@dailytrendnews.in>',
      to: "contact@dailytrendnews.in",
      subject: "New Newsletter Subscriber",
      text: `New newsletter subscriber: ${email}`,
    });

    return NextResponse.json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}