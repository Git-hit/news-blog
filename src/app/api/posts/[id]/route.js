import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';
import { ObjectId } from 'mongodb';
import parseForm from '@/src/lib/parseForm';

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET post by id
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

// DELETE post and its images
export async function DELETE(_, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const post = await db.collection('posts').findOne({ _id: new ObjectId(params.id) });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const deleteFile = (relativePath) => {
      if (relativePath) {
        const fullPath = path.join(process.cwd(), 'public', relativePath);
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
  const id = params.id;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fsp.mkdir(uploadDir, { recursive: true });

  const { fields, files } = await parseForm(req, uploadDir);

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
  const imageUrl = newImage ? `${path.basename(newImage.filepath)}` : null;
  const ogImageUrl = newOgImage ? `${path.basename(newOgImage.filepath)}` : null;

  try {
    const client = await clientPromise;
    const db = client.db();

    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const deleteFile = (filePath) => {
      const fullPath = path.join(process.cwd(), 'public', filePath);
      if (filePath && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
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