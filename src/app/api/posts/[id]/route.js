import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

// DELETE POST + delete image & og image
export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const client = await pool.connect();

    // Fetch post to get image paths
    const result = await client.query('SELECT image, og_image FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const { image, og_image } = result.rows[0];

    const deleteFile = (relativePath) => {
      if (relativePath) {
        const fullPath = path.join(process.cwd(), 'public', relativePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    };

    deleteFile(image);
    deleteFile(og_image);

    await client.query('DELETE FROM posts WHERE id = $1', [id]);
    client.release();

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}

// PUT: Update post with optional image/og_image replacement
export async function PUT(req, { params }) {
  const { id } = params;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fsp.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      const timestamp = Date.now();
      return `${timestamp}-${part.originalFilename}`;
    },
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
      slug,
      categories,
      metaTitle,
      metaDescription,
      focusKeyword,
      canonicalUrl,
      robotsTag,
      ogTitle,
      ogDescription,
      featured,
    } = fields;

    const newImage = files.image?.[0];
    const newOgImage = files.ogImage?.[0];
    const imageUrl = newImage ? `/uploads/${path.basename(newImage.filepath)}` : null;
    const ogImageUrl = newOgImage ? `/uploads/${path.basename(newOgImage.filepath)}` : null;

    const client = await pool.connect();

    // Get old image paths to delete if replaced
    const oldPost = await client.query('SELECT image, og_image FROM posts WHERE id = $1', [id]);
    if (oldPost.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const oldImage = oldPost.rows[0].image;
    const oldOgImage = oldPost.rows[0].og_image;

    if (newImage && oldImage) {
      const oldPath = path.join(process.cwd(), 'public', oldImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    if (newOgImage && oldOgImage) {
      const oldPath = path.join(process.cwd(), 'public', oldOgImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await client.query(
      `UPDATE posts SET
        title = $1,
        content = $2,
        slug = $3,
        categories = $4,
        meta_title = $5,
        meta_description = $6,
        focus_keyword = $7,
        canonical_url = $8,
        robots_tag = $9,
        og_title = $10,
        og_description = $11,
        image = COALESCE($12, image),
        og_image = COALESCE($13, og_image),
        featured = $14,
        updated_at = NOW()
       WHERE id = $15`,
      [
        title,
        content,
        slug,
        categories ? JSON.stringify(JSON.parse(categories)) : null,
        metaTitle,
        metaDescription,
        focusKeyword,
        canonicalUrl,
        robotsTag || 'index, follow',
        ogTitle,
        ogDescription,
        imageUrl,
        ogImageUrl,
        featured === 'true' ? 1 : 0,
        id,
      ]
    );

    client.release();
    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

// GET POST by ID
export async function GET(_, { params }) {
  const { id } = params;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM posts WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post: result.rows[0] });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 });
  }
}