import { Client } from 'pg';
import { MongoClient } from 'mongodb';

const pgClient = new Client({
    user: 'postgres',
    host: '194.164.148.58',
    database: 'postgres',
    password: 'postgresPassword',
    port: 5432,
});

const mongoUri = process.env.NEXT_PUBLIC_MONGO_URI;
const mongoClient = new MongoClient(mongoUri);

async function migrate() {
  try {
    await pgClient.connect();
    await mongoClient.connect();
    const mongoDb = mongoClient.db();

    console.log('✅ Connected to PostgreSQL and MongoDB');

    // Step 1: Get all user tables
    const tablesRes = await pgClient.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type='BASE TABLE';
    `);
    const tables = tablesRes.rows.map(row => row.table_name);

    for (const table of tables) {
      console.log(`📦 Migrating table: ${table}`);

      const rows = await pgClient.query(`SELECT * FROM ${table}`);
      if (rows.rows.length === 0) {
        console.log(`  ⚠️  Table '${table}' is empty. Skipping.`);
        continue;
      }

      // Insert into MongoDB
      const collection = mongoDb.collection(table);
      await collection.insertMany(rows.rows);
      console.log(`  ✅ Inserted ${rows.rowCount} rows into '${table}'`);
    }

    console.log('\n🎉 Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pgClient.end();
    await mongoClient.close();
  }
}

migrate();