import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Instagram from './utils/Instagram';
import ImageProcessor from './utils/ImageProcessor';
import Reddit from './utils/Reddit';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { PostDbRow } from './interfaces';
import bodyParser from 'body-parser';

// Env variables
dotenv.config();

// App
const app: Express = express();
const port = process.env.PORT;

// Database
const db = open({
  filename: './db/memes.db',
  driver: sqlite3.Database
})

app.use(bodyParser.json({ type: 'application/json' }))


app.get('/', async (_: Request, res: Response) => {
  res.status(200).send('Follow: https://www.instagram.com/freshmemus/ https://www.instagram.com/codermemus/')
});

app.post('/publish/:acc', async (req: Request, res: Response) => {
  const acc = req.params.acc;
  const key = req.body.key;

  if (key !== process.env.KEY) {
    res.status(401).send('Unauthorized');
    return;
  }

  if (acc !== process.env.USER_fresh && acc !== process.env.USER_coder) {
    res.status(403).send('Forbidden');
    return;
  }

  let response;
  if (acc === process.env.USER_fresh) {
    response = await Reddit.getHot('dankmemes', 50)
  }
  else if (acc === process.env.USER_coder) {
    response = await Reddit.getHot('ProgrammerHumor', 50)
  } else {
    res.status(500).send('Internal Server Error');
    return;
  }

  const rows = await (await db).all('SELECT posts.id FROM posts JOIN accounts ON posts.account_id = accounts.id WHERE accounts.id = ?', [acc]) as PostDbRow[];
  const newPost = Reddit.getFresh(response, rows);

  if(!newPost) { // Should never happen
    res.send('No new posts');
    return;
  }

  const imgBuffer = await ImageProcessor.downloadImg(newPost.imgUrl);
  const resizeBuffer = await ImageProcessor.resizeImg(imgBuffer);

  let insta;
  if (acc === process.env.USER_fresh) {
    insta = new Instagram(process.env.USER_fresh!, process.env.PASS_fresh!);
  } else if (acc === process.env.USER_coder) {
    insta = new Instagram(process.env.USER_coder!, process.env.PASS_coder!);
  } else {
    res.status(500).send('Internal server error');
    return;
  }

  await insta.init();
  const caption = insta.generateCaption(newPost);
  insta.publish(resizeBuffer, caption);

  (await db).all('INSERT INTO posts VALUES(?, ?)', [newPost.id, acc]);

  res.send('ok... best effort :D');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});