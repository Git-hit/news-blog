import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    // console.log("Reading file from:", filePath);
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    const contentType =
      ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".png"
        ? "image/png"
        : ext === ".webp"
        ? "image/webp"
        : "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("File serve error:", err);
    return new NextResponse("Error reading file", { status: 500 });
  }
}