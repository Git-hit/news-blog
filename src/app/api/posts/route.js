import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
    client.release();

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

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

    // Extract form fields
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

    const image = files.image?.[0];
    const ogImage = files.ogImage?.[0];

    const imageUrl = image ? `/uploads/${path.basename(image.filepath)}` : null;
    const ogImageUrl = ogImage ? `/uploads/${path.basename(ogImage.filepath)}` : null;

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO posts (
        title, content, slug, categories,
        meta_title, meta_description, focus_keyword,
        canonical_url, robots_tag, og_title, og_description,
        image, og_image, featured, created_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10, $11,
        $12, $13, $14, NOW()
      ) RETURNING *`,
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
      ]
    );

    client.release();

    return NextResponse.json(
      { post: result.rows[0], message: 'Post created successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create error:', err);
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }
}