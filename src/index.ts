import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import fs from 'fs';

import initDatabase from './database/init';
import login from './login';
import logout from './logout';
import metric from './metric';
import user from './user';
import activity from './activity';
import withAuth from './withAuth';
import fitbit from './fitbit';

const PORT = 9000;

initDatabase().then(() => {
  console.log('======== database initialized!');
  createServer();
});

const createServer = () => {
  const app = express();

  const allowList: string[] = [];
  const corsOptions: cors.CorsOptions = {
    origin: allowList,
    credentials: true,
  };

  app.use(cookieParser(process.env.NODE_COOKIE_SECRET));
  app.use(cors(corsOptions));
  app.use(express.json());

  app.get('/api/', (req, res) => {
    res.send('success!')
  });
  app.use('/api/login', login);
  app.use('/api/fitbit', fitbit);

  app.use('/api/logout', withAuth, logout);
  app.use('/api/user', withAuth, user);
  app.use('/api/activity', withAuth, activity);
  app.use('/api/metric', withAuth, metric);

  https
    .createServer(
      {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem'),
      },
      app
    )
    .listen(PORT, () => {
      console.log(`https server is running at port ${PORT}`);
    });
};
