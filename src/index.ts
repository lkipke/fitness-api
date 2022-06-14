import express, { Request, Response } from 'express';
import cors from 'cors';
// import cookieParser from 'cookie-parser';

const createServer = () => {
  const port = process.env.NODE_DOCKER_PORT;

  const allowList: string[] = JSON.parse(process.env.CLIENT_ORIGIN_ALLOW_LIST);
  const corsOptions: cors.CorsOptions = {
    origin: allowList,
    credentials: true,
  };

  const app = express();
  // app.use(cookieParser(process.env.NODE_COOKIE_SECRET));
  app.use(cors(corsOptions));
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html');
  });

  app.get('/callback', (req: Request, res: Response) => {
    // callback code goes here
    res.send('Hello World!');
  });

  app.get('/api', (req: Request, res: Response) => {
    res.send('API: Hello World!');
  });

  app.get('/api/oauth_callback', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

createServer();

// initDatabase().then(() => {
//   console.log('======== database initialized!');
//   createServer();
// });
