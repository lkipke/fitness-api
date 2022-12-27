import { Router } from 'express';

const router = Router();
router.get('/', async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  } else {
    return res.status(200).json(req.user.toJSON());
  }
});

export default router;
