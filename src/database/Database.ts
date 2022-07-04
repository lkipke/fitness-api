import { Db, Document, MongoClient, Collection } from 'mongodb';

export const intradayMetrics = [
  'steps',
  'calories',
  'distance',
  'elevation',
  'floors',
] as const;
export type IntradayMetric = typeof intradayMetrics[number];

export type CollectionType = IntradayMetric | 'auth' | 'activity_summary';

class Database {
  private database?: Db;

  async collection(name: CollectionType): Promise<Collection<Document>> {
    if (!this.database) {
      await this.connect();
    }

    return this.database!.collection(name);
  }

  async connect() {
    console.log('reconnecting for some reason');
    const USER = process.env.DB_USER;
    const PASS = process.env.DB_PASSWORD;
    const PORT = process.env.DB_PORT;
    const DB = process.env.MONGO_DB_DATABASE;

    const url = `mongodb://${USER}:${PASS}@mongo:${PORT}/${DB}`;
    const client = new MongoClient(url);
    await client.connect();

    console.log('Connected successfully to MongoDB server!');

    this.database = client.db(process.env.DB_NAME);
  }
}

const database = new Database();

export const getAuthDb = async () => await database.collection('auth');
export const getActivitySummaryDb = async () =>
  await database.collection('activity_summary');
export const getActivityIntradayDb = async (metric: IntradayMetric) =>
  await database.collection(metric);

export const init = () => database.connect();
export const connect = () => database.connect();
