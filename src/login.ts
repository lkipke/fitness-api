import { Router } from 'express';
import AuthSession from './database/models/AuthSession';
import User from './database/models/User';
import { generateHashFromPassword, generateSessionToken } from './helpers';
import withAuth from './withAuth';

const router = Router();
router.post('/', async (req, res, next) => {
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  if (!username || !password) {
    return res.status(400).send('Malformed authorization header');
  }

  let hashedPassword = generateHashFromPassword(password);
  let user = await User.findOne({
    where: {
      username,
      password: hashedPassword,
    },
    attributes: {
      exclude: ['authToken', 'password'],
    },
  });

  if (!user) {
    return res
      .status(404)
      .send('No user found with that username-password combination.');
  }

  let authToken = await updateAuthToken(user.id);
  res.cookie('AuthToken', authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days
    httpOnly: true,
    signed: true,
    secure: true,
    sameSite: 'none',
  });

  return res.status(200).json(user.toJSON());
});

async function updateAuthToken(userId: string) {
  let sessionToken = generateSessionToken();
  await AuthSession.update(
    {
      sessionToken: sessionToken
    },
    {
      where: {
        UserId: userId,
      },
    }
  );

  return sessionToken;
}

export default router;
