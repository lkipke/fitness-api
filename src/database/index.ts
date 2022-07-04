import { AuthData } from '../fitbit';
import {
  getActivityIntradayDb,
  getActivitySummaryDb,
  getAuthDb,
  IntradayMetric,
} from './Database';

const parseAuthData = (data: AuthData) => {
  let { scope, ...dataToInsert } = data;
  return {
    ...dataToInsert,
    scopes: scope.split(' '),
  };
};

export const storeAuthCreds = async (data: AuthData) => {
  let db = await getAuthDb();

  await db.updateOne(
    { user_id: process.env.FITBIT_USER_ID },
    { $set: parseAuthData(data) },
    { upsert: true }
  );
};

export const storeActivityLogs = async (entries: Record<string, any>[]) => {
  let db = await getActivitySummaryDb();
  let withIds = entries.map((entry) => ({ ...entry, _id: entry.logId }));

  await db.insertMany(withIds);
};

export const storeActivityIntraday = async (
  metricType: IntradayMetric,
  entries: Record<string, any>[]
) => {
  let db = await getActivityIntradayDb(metricType);
  await db.insertMany(entries);
};

export * from './Database';
