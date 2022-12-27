import { createHash, randomBytes } from 'crypto';

export const generateSessionToken = () => {
  return randomBytes(30).toString('hex');
};

export const generateHashFromPassword = (password: string) =>
  createHash('sha256').update(password).digest('base64');
