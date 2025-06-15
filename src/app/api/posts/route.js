import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
// import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { promises as fsp } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET all posts (latest first)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const postsCollection = db.collection('posts');

    const posts = await postsCollection.find({}).sort({ created_at: -1 }).toArray();

    return NextResponse.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST new post
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

    const client = await clientPromise;
    const db = client.db();
    const postsCollection = db.collection('posts');

    const postData = {
      title,
      content,
      slug,
      categories: categories ? JSON.parse(categories) : [],
      meta_title: metaTitle,
      meta_description: metaDescription,
      focus_keyword: focusKeyword,
      canonical_url: canonicalUrl,
      robots_tag: robotsTag || 'index, follow',
      og_title: ogTitle,
      og_description: ogDescription,
      image: imageUrl,
      og_image: ogImageUrl,
      featured: featured === 'true',
      created_at: new Date(),
    };

    const result = await postsCollection.insertOne(postData);

    return NextResponse.json(
      { post: { _id: result.insertedId, ...postData }, message: 'Post created successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create error:', err);
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }
}