import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
import formidable from 'formidable';
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
    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

    const pages = await pagesCollection.find().sort({ created_at: -1 }).toArray();

    return NextResponse.json(pages);
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

    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

    // Manually generate integer ID if needed (optional)
    const last = await pagesCollection.find().sort({ id: -1 }).limit(1).next();
    const newId = last ? last.id + 1 : 1;

    const pageDoc = {
      id: newId,
      title,
      content,
      meta_title: metaTitle,
      meta_description: metaDescription,
      focus_keyword: focusKeyword,
      slug,
      canonical_url: canonicalUrl,
      robots_tag: robotsTag || 'index, follow',
      og_title: ogTitle,
      og_description: ogDescription,
      image: imageUrl,
      og_image: ogImageUrl,
      created_at: new Date(),
    };

    await pagesCollection.insertOne(pageDoc);

    return NextResponse.json({ page: pageDoc, message: 'Page created successfully' }, { status: 201 });
  } catch (err) {
    console.error('Create error:', err);
    return NextResponse.json({ message: 'Failed to create page' }, { status: 500 });
  }
}