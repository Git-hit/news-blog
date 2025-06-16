import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';
import { ObjectId } from 'mongodb';
import formidable from 'formidable';
import { Readable } from 'stream';

const uploadDir = path.join(process.cwd(), 'uploads'); // ✅ outside /public
await fsp.mkdir(uploadDir, { recursive: true });

async function parseForm(req) {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024,
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
  });

  const reqStream = Readable.fromWeb(req.body);
  reqStream.headers = Object.fromEntries(req.headers.entries());

  return new Promise((resolve, reject) => {
    form.parse(reqStream, (err, fields, files) => {
      if (err) return reject(err);

      // console.log(fields);

      const flatFields = {};
      for (const key in fields) {
        flatFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      }

      resolve({ fields: flatFields, files });
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET post by ID
export async function GET(_, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(params.id) });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 });
  }
}

// DELETE post and uploaded images
export async function DELETE(_, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const post = await db.collection('posts').findOne({ _id: new ObjectId(params.id) });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const deleteFile = (urlPath) => {
      if (urlPath?.startsWith('/api/uploads/')) {
        const filename = urlPath.replace('/api/uploads/', '');
        const fullPath = path.join(uploadDir, filename);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    };

    deleteFile(post.image);
    deleteFile(post.og_image);

    await db.collection('posts').deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}

// POST (update) post
export async function POST(req, { params }) {
  const { id } = await params;

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

  // console.log(fields.categories);

  const newImage = files.image?.[0];
  const newOgImage = files.ogImage?.[0];

  const imageUrl = newImage ? `/api/uploads/${path.basename(newImage.filepath)}` : null;
  const ogImageUrl = newOgImage ? `/api/uploads/${path.basename(newOgImage.filepath)}` : null;

  try {
    const client = await clientPromise;
    const db = client.db();

    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const deleteFile = (urlPath) => {
      if (urlPath?.startsWith('/api/uploads/')) {
        const filename = urlPath.replace('/api/uploads/', '');
        const fullPath = path.join(uploadDir, filename);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    };

    if (newImage && post.image) deleteFile(post.image);
    if (newOgImage && post.og_image) deleteFile(post.og_image);

    const updatedPost = {
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
      image: imageUrl ?? post.image,
      og_image: ogImageUrl ?? post.og_image,
      featured: featured === 'true',
      updated_at: new Date(),
    };

    await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPost }
    );

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}