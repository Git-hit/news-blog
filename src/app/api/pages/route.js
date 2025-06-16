import path from 'path';
import { mkdir } from 'fs/promises';
import { Readable } from 'stream';
import formidable from 'formidable';
import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'uploads');

async function parseForm(req) {
  await mkdir(uploadDir, { recursive: true });

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

      const flatFields = {};
      for (const key in fields) {
        flatFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      }

      resolve({ fields: flatFields, files });
    });
  });
}

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

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);

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

    const imageUrl = image ? `/api/uploads/${path.basename(image.filepath)}` : null;
    const ogImageUrl = ogImage ? `/api/uploads/${path.basename(ogImage.filepath)}` : null;

    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

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