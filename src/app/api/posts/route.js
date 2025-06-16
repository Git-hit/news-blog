import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
import path from 'path';
import formidable from 'formidable';
import { mkdir } from 'fs/promises';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'uploads');

// GET all posts (latest first)
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const postsCollection = db.collection('posts');

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 0;
    const page = parseInt(searchParams.get('page')) || 1;
    const onlyMetadata = searchParams.get('only_metadata') === 'true';

    const query = {};
    const sort = { created_at: -1 };

    let cursor = postsCollection.find(query).sort(sort);

    if (onlyMetadata) {
      cursor = cursor.project({
        _id: 1,
        title: 1,
        slug: 1,
        featured: 1,
        views: 1,
      });
    }

    const total = await postsCollection.countDocuments(query);

    if (limit > 0) {
      cursor = cursor.skip((page - 1) * limit).limit(limit);
    }

    const posts = await cursor.toArray();

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST new post
async function parseForm(req) {
  await mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
  });

  const reqStream = Readable.fromWeb(req.body);
  reqStream.headers = Object.fromEntries(req.headers.entries());

  return new Promise((resolve, reject) => {
    form.parse(reqStream, (err, fields, files) => {
      if (err) return reject(err);

      const flatFields = {};
      for (const key in fields) {
        flatFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      }

      resolve({ fields: flatFields, files });
    });
  });
}

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);

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

    const imageUrl = image ? `/api/uploads/${path.basename(image.filepath)}` : null;
    const ogImageUrl = ogImage ? `/api/uploads/${path.basename(ogImage.filepath)}` : null;

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