import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Collection, Document } from 'mongodb';

import initDb from './database/init';

const port = process.env.NODE_DOCKER_PORT;

const allowList: string[] = JSON.parse(process.env.CLIENT_ORIGIN_ALLOW_LIST);
const corsOptions: cors.CorsOptions = {
  origin: allowList,
  credentials: true,
};

const createServer = (database: Collection<Document>) => {
  const app = express();
  https
    .createServer(
      {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem'),
      },
      app
    )
    .listen(port, () => {
      console.log(`server is running at port ${port}`);
    });

  app.use(cors(corsOptions));
  app.use(express.json());
  app.locals.database = database;

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });

  app.get('/test', async (req: Request, res: Response) => {
    let database: Collection<Document> = req.app.locals.database;
    await database.insertMany([{ we: 'did it!' }]);
    res.send('successful!');
  });

  app.get('/callback', (req: Request, res: Response) => {
    console.log('BODY', req.body);
    res.send('successful callback!');
  });
};

initDb().then(createServer);
