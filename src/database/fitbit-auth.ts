import { Collection, Document } from 'mongodb';
import { AuthSuccess } from '../auth';

export const storeAuthCreds = (
  db: Collection<Document>,
  data: Omit<AuthSuccess, 'success'>
) => {
  console.log('DB', db);
  console.log('data', data);
  db.insertOne(data);
};
