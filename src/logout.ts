import { Router } from 'express';
import AuthSession from './database/models/AuthSession';

const router = Router();
router.post('/', async (req, res, next) => {
  await AuthSession.update(
    {
      sessionToken: null,
    },
    {
      where: {
        UserId: req.user.id,
      },
    }
  );

  res.clearCookie('AuthToken');
  return res.sendStatus(200);
});

export default router;
