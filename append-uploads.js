import { MongoClient } from 'mongodb';

const uri = "mongodb://admin:dtnMongoDBPassword@194.164.148.58:27017/dtnDB?authSource=admin";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db(); // Or specify db name: client.db('your-db-name')
    const collection = db.collection('posts'); // Change to your collection name

    const cursor = collection.find({
      $or: [
        { image: { $exists: true, $ne: null } },
        { og_image: { $exists: true, $ne: null } },
      ],
    });

    const bulkOps = [];

    await cursor.forEach((doc) => {
      const update = {};
      if (doc.image && !doc.image.startsWith('/uploads/')) {
        update.image = `/uploads/${doc.image.replace(/^\/?uploads\/?/, '')}`;
      }
      if (doc.og_image && !doc.og_image.startsWith('/uploads/')) {
        update.og_image = `/uploads/${doc.og_image.replace(/^\/?uploads\/?/, '')}`;
      }

      if (Object.keys(update).length) {
        bulkOps.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: update },
          },
        });
      }
    });

    if (bulkOps.length) {
      const result = await collection.bulkWrite(bulkOps);
      console.log(`✅ Updated ${result.modifiedCount} documents.`);
    } else {
      console.log('No documents needed updates.');
    }
  } catch (err) {
    console.error('❌ Error updating documents:', err);
  } finally {
    await client.close();
  }
}

run();