import { NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';
// import parseForm from '@/src/lib/parseForm';
import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';
import { ObjectId } from 'mongodb';
import formidable from 'formidable';
import { Readable } from 'stream';

async function parseForm(req, uploadDir) {
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

      // ✅ Flatten field arrays
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

// GET one page by ID
export async function GET(_, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

    const page = await pagesCollection.findOne({ _id: new ObjectId(id) });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch page' }, { status: 500 });
  }
}

// POST → Update page
export async function POST(req, context) {
  const { params } = await context;
  const { id } = params;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fsp.mkdir(uploadDir, { recursive: true });

  try {
    // ✅ parse form data
    const { fields, files } = await parseForm(req, uploadDir);
    // const flatFields = flattenFields(fields);

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

    const newImage = files.image?.[0];
    const newOgImage = files.ogImage?.[0];
    const imageUrl = newImage ? `${path.basename(newImage.filepath)}` : null;
    const ogImageUrl = newOgImage ? `${path.basename(newOgImage.filepath)}` : null;

    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

    const page = await pagesCollection.findOne({ _id: new ObjectId(id) });
    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    const deleteFile = (filePath) => {
      const fullPath = path.join(process.cwd(), 'public', filePath);
      if (filePath && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    };

    if (newImage && page.image) deleteFile(page.image);
    if (newOgImage && page.og_image) deleteFile(page.og_image);

    const updateDoc = {
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
      updated_at: new Date(),
    };

    if (imageUrl) updateDoc.image = imageUrl;
    if (ogImageUrl) updateDoc.og_image = ogImageUrl;

    await pagesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    return NextResponse.json({ message: 'Page updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ message: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE one page
export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db();
    const pagesCollection = db.collection('pages');

    const page = await pagesCollection.findOne({ _id: new ObjectId(id) });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    const deleteFile = (filePath) => {
      const fullPath = path.join(process.cwd(), 'public', filePath);
      if (filePath && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    };

    if (page.image) deleteFile(page.image);
    if (page.og_image) deleteFile(page.og_image);

    await pagesCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ message: 'Failed to delete page' }, { status: 500 });
  }
}