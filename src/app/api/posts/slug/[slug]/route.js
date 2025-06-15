import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET(_, { params }) {
  const { slug } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();

    const postsCollection = db.collection('posts');
    const commentsCollection = db.collection('comments');

    // Get post
    const post = await postsCollection.findOne({ slug });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Get comments
    const comments = await commentsCollection.find({ postSlug: slug, status: "approved" }).sort({ created_at: -1 }).toArray();

    // Check if all posts have 0 views
    const postsWithViews = await postsCollection.countDocuments({ views: { $gt: 0 } });
    let allPosts;

    if (postsWithViews === 0) {
      allPosts = await postsCollection.find().sort({ created_at: -1 }).limit(5).toArray();
    } else {
      allPosts = await postsCollection.find().sort({ views: -1 }).limit(5).toArray();
    }

    return NextResponse.json({
      post,
      comments,
      allPosts,
    });

  } catch (err) {
    console.error('GET slug error:', err);
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 });
  }
}

// POST to increment views
export async function POST(_, { params }) {
  const { slug } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();

    const postsCollection = db.collection('posts');

    const post = await postsCollection.findOne({ slug });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    await postsCollection.updateOne({ slug }, { $inc: { views: 1 } });

    return NextResponse.json({ message: 'View count incremented' });
  } catch (err) {
    console.error('View increment error:', err);
    return NextResponse.json({ message: 'Failed to increment view count' }, { status: 500 });
  }
}