import { Router } from 'express';
import Metric from './database/models/Metric';
import sequelize from './database/sequelize';
import Activity from './database/models/Activity';

const router = Router();

router.get('/most_recent', async (req, res, next) => {
  let recentActivity = await Activity.findOne({
    group: 'id',
    order: [[sequelize.fn('max', sequelize.col('createdAt')), 'DESC']],
  });

  if (recentActivity) {
    return res.status(200).json(recentActivity.toJSON());
  } else {
    return res.sendStatus(404);
  }
});

router.get('/activities', async (req, res, next) => {
  let pageOffset = parseInt(req.query.pageOffset as string);
  let pageSize = parseInt(req.query.pageSize as string);
  if (isNaN(pageOffset) || isNaN(pageSize)) {
    return res.status(400).send('pageOffset and pageSize must be specified');
  }

  let activities = await Activity.findAndCountAll({
    offset: pageOffset * pageSize,
    limit: pageSize,
  });

  if (!activities?.rows.length) {
    return res.sendStatus(404);
  }

  return res
    .status(200)
    .json({
      sessions: activities.rows.map((s) => s.toJSON()),
      total: activities.count
    });
});

router.get('/:id', async (req, res, next) => {
  let session = await Activity.findOne({
    group: 'id',
    where: {
      id: req.params.id,
    },
  });

  if (!session) {
    return res.sendStatus(404);
  }

  let metrics = await Metric.findAll({
    where: {
      ActivityId: req.params.id,
    },
  });

  return res.status(200).json({
    session: session.toJSON(),
    data: metrics.map((m) => {
      let json = m.toJSON();
      return {
        ...json,
        time: m.timestamp.getTime(),
      };
    }),
  });
});

router.delete('/:id', async (req, res, next) => {
  await Activity.destroy({
    where: {
      id: req.params.id,
    },
  });

  return res.sendStatus(200);
});

router.post('/create', async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send('Name must be non-empty string');
  }

  let newSession = await Activity.create({
    name: req.body.name,
    UserId: req.user.id,
  });

  return res.status(200).json(newSession.toJSON());
});

export default router;
