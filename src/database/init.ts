import { MongoClient } from 'mongodb';


export default async () => {
  const USER = process.env.DB_USER;
  const PASS = process.env.DB_PASSWORD;
  const PORT = process.env.DB_PORT;
  const DB = process.env.MONGO_DB_DATABASE;

  const url = `mongodb://${USER}:${PASS}@mongo:${PORT}/${DB}`;
  const client = new MongoClient(url);
  await client.connect();

  console.log('Connected successfully to MongoDB server!');

  const db = client.db('fitbit');
  const collection = db.collection('documents');

  return collection;
};
