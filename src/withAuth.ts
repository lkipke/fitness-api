import { NextFunction, Request, Response } from 'express';
import User from './database/models/User';

async function withAuth(req: Request, res: Response, next: NextFunction) {
  let user: User | null = null;
  let authToken = req.signedCookies.AuthToken;
  if (authToken) {
    user = await User.findOne({
      where: {
        authToken,
      },
    });
  }

  if (!user) {
    return res.status(401).send();
  }

  (req as any).user = user;
  return next();
}

export default withAuth;
