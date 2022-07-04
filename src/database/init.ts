import { Collection, Document, MongoClient } from 'mongodb';

export interface FitbitDatabases {
  fitbitData: Collection<Document>;
  fitbitAuth: Collection<Document>;
}

export default async (): Promise<FitbitDatabases> => {
  const USER = process.env.DB_USER;
  const PASS = process.env.DB_PASSWORD;
  const PORT = process.env.DB_PORT;
  const DB = process.env.MONGO_DB_DATABASE;

  const url = `mongodb://${USER}:${PASS}@mongo:${PORT}/${DB}`;
  const client = new MongoClient(url);
  await client.connect();

  console.log('Connected successfully to MongoDB server!');

  const db = client.db(process.env.DB_DATA_NAME);

  return {
    fitbitData: db.collection('data'),
    fitbitAuth: db.collection('auth'),
  };
};
