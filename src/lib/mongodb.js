import { MongoClient } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGO_URI;
const client = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise;