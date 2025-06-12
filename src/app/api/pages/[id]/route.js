import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { promises as fsp } from 'fs';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Convert web request to Node-readable stream
function toNodeRequest(req) {
  const body = Readable.from(req.body);
  const headers = {};

  req.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  Object.assign(body, {
    headers,
    method: req.method,
    url: req.url,
  });

  return body;
}

// GET one page by ID
export async function GET(_, { params }) {
  const { id } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM pages WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page: result.rows[0] });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT update a page
export async function POST(req, { params }) {
  const { id } = params;
  const nodeReq = toNodeRequest(req);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fsp.mkdir(uploadDir, { recursive: true });

  const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024,
      filename: (name, ext, part) => {
        return `${Date.now()}-${part.originalFilename}`;
      },
    });

  try {
    const { fields } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
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

    // const newImage = files.image?.[0];
    // const newOgImage = files.ogImage?.[0];
    // const imageUrl = newImage ? `/uploads/${path.basename(newImage.filepath)}` : null;
    // const ogImageUrl = newOgImage ? `/uploads/${path.basename(newOgImage.filepath)}` : null;

    const client = await pool.connect();
    // const result = await client.query('SELECT image, og_image FROM pages WHERE id = $1', [id]);
    // if (result.rows.length === 0) {
    //   client.release();
    //   return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    // }

    // const old = result.rows[0];
    // const deleteFile = (file) => {
    //   const filePath = path.join(process.cwd(), 'public', file);
    //   if (file && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    // };

    // if (newImage) deleteFile(old.image);
    // if (newOgImage) deleteFile(old.og_image);

    await client.query(
      `UPDATE pages SET
        title = $1,
        content = $2,
        meta_title = $3,
        meta_description = $4,
        focus_keyword = $5,
        slug = $6,
        canonical_url = $7,
        robots_tag = $8,
        og_title = $9,
        og_description = $10,
        updated_at = NOW()
      WHERE id = $11`,
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
        // imageUrl,
        // ogImageUrl,
        id,
      ]
    );

    client.release();
    return NextResponse.json({ message: 'Page updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ message: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE a page
export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT image, og_image FROM pages WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    const { image, og_image } = result.rows[0];
    const deleteFile = (file) => {
      const filePath = path.join(process.cwd(), 'public', file);
      if (file && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    };

    deleteFile(image);
    deleteFile(og_image);

    await client.query('DELETE FROM pages WHERE id = $1', [id]);
    client.release();

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ message: 'Failed to delete page' }, { status: 500 });
  }
}