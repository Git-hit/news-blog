import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET all pages
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM pages ORDER BY created_at DESC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST create a page
export async function POST(req) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fsp.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const {
      title,
      content,
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      canonicalUrl,
      robotsTag,
      ogTitle,
      ogDescription,
    } = fields;

    const image = files.image?.[0];
    const ogImage = files.ogImage?.[0];
    const imageUrl = image ? `/uploads/${path.basename(image.filepath)}` : null;
    const ogImageUrl = ogImage ? `/uploads/${path.basename(ogImage.filepath)}` : null;

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO pages (
        title, content, meta_title, meta_description, focus_keyword,
        slug, canonical_url, robots_tag, og_title, og_description,
        image, og_image, created_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, NOW()
      ) RETURNING *`,
      [
        title,
        content,
        metaTitle,
        metaDescription,
        focusKeyword,
        slug,
        canonicalUrl,
        robotsTag || 'index, follow',
        ogTitle,
        ogDescription,
        imageUrl,
        ogImageUrl,
      ]
    );

    client.release();
    return NextResponse.json({ page: result.rows[0], message: 'Page created successfully' }, { status: 201 });
  } catch (err) {
    console.error('Create error:', err);
    return NextResponse.json({ message: 'Failed to create page' }, { status: 500 });
  }
}