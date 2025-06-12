import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

// GET post by slug + comments + 5 popular posts
export async function GET(_, context) {
  const { slug } = context.params;

  console.log("Slug: ", slug);

  try {
    const client = await pool.connect();

    // Get post
    const postResult = await client.query('SELECT * FROM posts WHERE slug = $1', [slug]);
    if (postResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    const post = postResult.rows[0];

    // Get comments
    const commentsResult = await client.query('SELECT * FROM comments WHERE "post-slug" = $1', [slug]);
    const comments = commentsResult.rows;

    // Check if all posts have 0 views
    const viewsCountResult = await client.query('SELECT COUNT(*) FROM posts WHERE views > 0');
    const allZeroViews = viewsCountResult.rows[0].count === '0';

    let allPosts;
    if (allZeroViews) {
      const res = await client.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 5');
      allPosts = res.rows;
    } else {
      const res = await client.query('SELECT * FROM posts ORDER BY views DESC LIMIT 5');
      allPosts = res.rows;
    }

    client.release();

    return NextResponse.json({
      post,
      comments,
      allPosts
    });

  } catch (err) {
    console.error('GET slug error:', err);
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 });
  }
}

// POST to increment views
export async function POST(_, { params }) {
  const { slug } = params;

  try {
    const client = await pool.connect();

    const postRes = await client.query('SELECT * FROM posts WHERE slug = $1', [slug]);
    if (postRes.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    await client.query('UPDATE posts SET views = views + 1 WHERE slug = $1', [slug]);

    client.release();
    return NextResponse.json({ message: 'View count incremented' });
  } catch (err) {
    console.error('View increment error:', err);
    return NextResponse.json({ message: 'Failed to increment view count' }, { status: 500 });
  }
}